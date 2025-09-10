import { analyzeAndNotifyContent } from "../services/educationalNotification.service.js";
import cloudinary from "../libs/cloudinary.js";
import mongoose from "mongoose";
import { getRecommendedContent } from "../services/recommendedContent.service.js";
import EducationalContent from "../models/educationalContent.model.js";
import EducationalHistory from "../models/educationalHistory.model.js";
import Users from "../models/user.model.js";
import { evaluatePatient } from "../services/ai.service.js";
import { createAlertsFromAI } from "../services/alert.service.js";

const mapMimeToFileType = (mimetype) => {
  if (mimetype?.startsWith("image/")) return "image";
  if (mimetype?.startsWith("video/")) return "video";
  return null;
};

export const uploadEducationalContent = async (req, res) => {
  let uploadedFileId = null;
  try {
    const {
      title,
      description,
      relatedSymptoms,
      treatmentStage,
      clinicalTags,
      isPublic: isPublicRaw,
    } = req.body;

    const isPublic =
      isPublicRaw === true ||
      isPublicRaw === "true" ||
      isPublicRaw === 1 ||
      isPublicRaw === "1";

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Debe proporcionar un archivo de imagen o video.",
      });
    }

    uploadedFileId = req.file.filename;
    const media = [
      {
        cloudinaryPublicId: uploadedFileId,
        fileType: mapMimeToFileType(req.file.mimetype),
      },
    ];

    const normalizedSymptoms =
      typeof relatedSymptoms === "string" && relatedSymptoms.length > 0
        ? relatedSymptoms.split(",").map((s) => s.trim())
        : [];

    const normalizedTags =
      typeof clinicalTags === "string" && clinicalTags.length > 0
        ? clinicalTags.split(",").map((t) => t.trim())
        : [];

    const content = new EducationalContent({
      title,
      description,
      fileType: media[0].fileType,
      media,
      uploadBy: req.user.id,
      relatedSymptoms: normalizedSymptoms,
      treatmentStage,
      clinicalTags: normalizedTags,
      isPublic,
    });

    await content.save();
    await analyzeAndNotifyContent(content._id);

    res.status(201).json({
      ok: true,
      content,
      message: "Contenido educativo subido exitosamente.",
    });
  } catch (error) {
    if (uploadedFileId) {
      try {
        await cloudinary.uploader.destroy(
          `educational-content/${uploadedFileId}`,
          { resource_type: "auto" }
        );
      } catch {}
    }
    res
      .status(500)
      .json({ ok: false, message: "No se pudo subir el contenido." });
  }
};

export const updateEducationalContent = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const contentId = req.params.id;

    const content = await EducationalContent.findOne({
      _id: contentId,
      uploadBy: doctorId,
    });

    if (!content) {
      return res.status(404).json({
        ok: false,
        message: "Contenido no encontrado o sin permisos.",
      });
    }

    const fieldsToUpdate = { ...req.body };

    if (
      !fieldsToUpdate.description ||
      fieldsToUpdate.description.trim() === ""
    ) {
      return res.status(400).json({
        ok: false,
        message: "La descripción es obligatoria.",
      });
    }

    if (fieldsToUpdate.relatedSymptoms) {
      fieldsToUpdate.relatedSymptoms = Array.isArray(
        fieldsToUpdate.relatedSymptoms
      )
        ? fieldsToUpdate.relatedSymptoms
        : typeof fieldsToUpdate.relatedSymptoms === "string" &&
          fieldsToUpdate.relatedSymptoms.length > 0
        ? fieldsToUpdate.relatedSymptoms.split(",").map((s) => s.trim())
        : [];
    }

    if (fieldsToUpdate.clinicalTags) {
      fieldsToUpdate.clinicalTags = Array.isArray(fieldsToUpdate.clinicalTags)
        ? fieldsToUpdate.clinicalTags
        : typeof fieldsToUpdate.clinicalTags === "string" &&
          fieldsToUpdate.clinicalTags.length > 0
        ? fieldsToUpdate.clinicalTags.split(",").map((t) => t.trim())
        : [];
    }

    let triggerNotification = false;

    const newIsPublic =
      fieldsToUpdate.isPublic === true ||
      fieldsToUpdate.isPublic === "true" ||
      fieldsToUpdate.isPublic === 1 ||
      fieldsToUpdate.isPublic === "1";

    if (newIsPublic !== content.isPublic) {
      triggerNotification = true;
    }

    if (
      Array.isArray(fieldsToUpdate.clinicalTags) &&
      JSON.stringify(fieldsToUpdate.clinicalTags) !==
        JSON.stringify(content.clinicalTags)
    ) {
      triggerNotification = true;
    }

    if (
      Array.isArray(fieldsToUpdate.relatedSymptoms) &&
      JSON.stringify(fieldsToUpdate.relatedSymptoms) !==
        JSON.stringify(content.relatedSymptoms)
    ) {
      triggerNotification = true;
    }

    Object.assign(content, fieldsToUpdate, { isPublic: newIsPublic });
    await content.save();

    if (triggerNotification) {
      await analyzeAndNotifyContent(content._id);
    }

    res.status(200).json({
      ok: true,
      message: "Contenido actualizado correctamente.",
      content,
      reanalyzed: triggerNotification,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "No se pudo actualizar el contenido.",
    });
  }
};

export const getDoctorUploads = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const {
      page = 1,
      limit = 10,
      title = "",
      symptom = "",
      treatmentStage,
      fileType,
    } = req.query;
    const query = { uploadBy: doctorId };

    if (title) query.title = { $regex: title, $options: "i" };
    if (symptom) query.relatedSymptoms = { $in: [symptom] };
    if (treatmentStage) query.treatmentStage = treatmentStage;
    if (fileType) query.fileType = fileType;

    const skip = (Number(page) - 1) * Number(limit);

    const [uploads, total] = await Promise.all([
      EducationalContent.find(query)
        .select("title fileType treatmentStage relatedSymptoms")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      EducationalContent.countDocuments(query),
    ]);

    res.status(200).json({
      ok: true,
      uploads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch {
    res
      .status(500)
      .json({ ok: false, message: "No se pudo obtener los contenidos." });
  }
};

export const getEducationalContentById = async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await EducationalContent.findById(contentId).populate(
      "uploadBy",
      "username email"
    );

    if (!content) {
      return res.status(200).json({
        ok: true,
        content: null,
      });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const mediaUrls =
      content.media?.map(
        (m) =>
          `https://res.cloudinary.com/${cloudName}/${m.fileType}/upload/${m.cloudinaryPublicId}`
      ) || [];

    res.status(200).json({
      ok: true,
      content: {
        _id: content._id,
        title: content.title,
        description: content.description,
        fileType: content.fileType,
        treatmentStage: content.treatmentStage,
        relatedSymptoms: content.relatedSymptoms,
        clinicalTags: content.clinicalTags,
        mediaUrls,
        uploadBy: content.uploadBy,
        isPublic: content.isPublic,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      },
    });
  } catch {
    res
      .status(500)
      .json({ ok: false, message: "No se pudo obtener el contenido." });
  }
};

export const deleteEducationalContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    if (!req.user?.id) {
      return res
        .status(401)
        .json({ ok: false, message: "Usuario no autorizado." });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ ok: false, message: "ID inválido." });
    }

    const content = await EducationalContent.findOne({
      _id: contentId,
      uploadBy: req.user.id,
    });

    if (!content) {
      return res.status(404).json({
        ok: false,
        message: "Contenido no encontrado o sin permisos.",
      });
    }

    if (content.media?.length > 0) {
      for (const m of content.media) {
        try {
          let resourceType = m.fileType;
          if (!["image", "video", "raw"].includes(resourceType))
            resourceType = "raw";

          await cloudinary.uploader.destroy(m.cloudinaryPublicId, {
            resource_type: resourceType,
          });
        } catch (cloudErr) {
          console.error("Error eliminando Cloudinary:", cloudErr);
        }
      }
    }

    await EducationalContent.findByIdAndDelete(contentId);

    res
      .status(200)
      .json({ ok: true, message: "Contenido eliminado correctamente." });
  } catch (error) {
    console.error("ERROR AL ELIMINAR:", error);
    res.status(500).json({
      ok: false,
      message: "No se pudo eliminar el contenido.",
      error: error.message,
    });
  }
};

export const getEducationalContentForPatient = async (req, res) => {
  try {
    const patientId = req.user.id;

    const {
      page = 1,
      limit = 10,
      title = "",
      symptom = "",
      treatmentStage,
      fileType,
    } = req.query;

    const publicQuery = { isPublic: true };
    if (title) publicQuery.title = { $regex: title, $options: "i" };
    if (symptom) publicQuery.relatedSymptoms = { $in: [symptom] };
    if (treatmentStage) publicQuery.treatmentStage = treatmentStage;
    if (fileType) publicQuery.fileType = fileType;

    const skip = (Number(page) - 1) * Number(limit);

    const [publicContents, totalPublic] = await Promise.all([
      EducationalContent.find(publicQuery)
        .select("title fileType treatmentStage relatedSymptoms")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      EducationalContent.countDocuments(publicQuery),
    ]);

    const recommended = await getRecommendedContent(patientId);

    res.status(200).json({
      ok: true,
      public: publicContents,
      recommended,
      pagination: {
        total: totalPublic,
        page: Number(page),
        totalPages: Math.ceil(totalPublic / Number(limit)),
      },
    });
  } catch {
    res.status(500).json({
      ok: false,
      message: "No se pudo obtener el contenido educativo.",
    });
  }
};

export const registerContentView = async (req, res) => {
  try {
    const patientId = req.user.id;
    const contentId = req.params.contentId;

    const exists = await EducationalHistory.findOne({
      patient: patientId,
      content: contentId,
    });

    if (!exists) {
      await EducationalHistory.create({
        patient: patientId,
        content: contentId,
      });
    }

    const evaluation = await evaluatePatient(patientId);
    const patient = await Users.findById(patientId).select("doctor");

    if (patient?.doctor && evaluation.triggeredRules.length > 0) {
      await createAlertsFromAI(
        patientId,
        patient.doctor,
        evaluation.triggeredRules
      );
    }

    res.status(201).json({
      ok: true,
      message: "Contenido registrado como visto y evaluación actualizada.",
      evaluation,
    });
  } catch (error) {
    console.error("[Error] Error en registerContentView:", error);
    res
      .status(500)
      .json({ ok: false, message: "No se pudo registrar la visualización." });
  }
};

export const getEducationalHistory = async (req, res) => {
  try {
    const { id: patientId } = req.params;

    const history = await EducationalHistory.find({ patient: patientId })
      .populate({
        path: "content",
        select:
          "title description fileType treatmentStage clinicalTags createdAt",
      })
      .sort({ viewedAt: -1 });

    res.status(200).json({ ok: true, history });
  } catch {
    res
      .status(500)
      .json({ ok: false, message: "No se pudo obtener el historial." });
  }
};

export const getEducationalHistoryByContent = async (req, res) => {
  try {
    const patientId = req.user.id;
    const contentId = req.params.contentId;

    const history = await EducationalHistory.findOne({
      patient: patientId,
      content: contentId,
    }).populate({
      path: "content",
      select:
        "title description fileType treatmentStage clinicalTags createdAt",
    });

    if (!history) {
      return res.status(200).json({
        ok: true,
        history: null,
      });
    }

    res.status(200).json({ ok: true, history });
  } catch {
    res.status(500).json({
      ok: false,
      message: "No se pudo obtener el historial del contenido.",
    });
  }
};
