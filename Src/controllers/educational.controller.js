import { evaluatePatient } from "../services/ai.service.js";
import { analyzeAndNotifyContent } from "../services/educationalNotification.service.js";
import EducationalContent from "../models/EducationalContent.model.js";
import EducationalHistory from "../models/EducationalHistory.model.js";

export const getRecommendedContentForPatient = async (req, res) => {
  try {
    const patientId = req.user.id;
    const evaluation = await evaluatePatient(patientId);

    const conditionsForEducation = new Set();

    if (evaluation.flags.abandono)
      conditionsForEducation.add("riesgo_abandono_alto");
    if (evaluation.flags.resistencia)
      conditionsForEducation.add("posible_resistencia");
    if (evaluation.adherenceLevel === "baja")
      conditionsForEducation.add("adh_baja");
    if (evaluation.dropoutRisk === "alto")
      conditionsForEducation.add("abandono_probable");

    const recommended = await EducationalContent.find({
      clinicalTags: { $in: Array.from(conditionsForEducation) },
    });


    res.status(200).json({
      ok: true,
      recommended,
      analysis: {
        conditionsMatched: conditionsForEducation,
        evaluation,
      },
    });
  } catch (error) {
    console.error("[Error] Error al obtener contenidos educativos:", error);
    res.status(500).json({
      ok: false,
      message: "Error al analizar datos del paciente.",
    });
  }
};

export const registerContentView = async (req, res) => {
  try {
    const patientId = req.user.id;
    const contentId = req.params.contentId;

    await EducationalHistory.create({
      patient: patientId,
      content: contentId,
    });

    res.status(201).json({
      ok: true,
      message: "Contenido registrado como visto.",
    });
  } catch (error) {
    console.error("[Error] Error al registrar visualización:", error);
    res
      .status(500)
      .json({ ok: false, message: "No se pudo registrar la visualización." });
  }
};

export const getEducationalHistory = async (req, res) => {
  try {
    const patientId = req.user.id;

    const history = await EducationalHistory.find({ patient: patientId })
      .populate("content");

    res.status(200).json({
      ok: true,
      history,
    });
  } catch (error) {
    console.error("[Error] Error al obtener historial:", error);
    res.status(500).json({ ok: false, message: "No se pudo obtener el historial." });
  }
};

export const uploadEducationalContent = async (req, res) => {
  try {
    const {
      title,
      description,
      fileUrl,
      fileType,
      relatedSymptoms,
      treatmentStage,
      clinicalTags,
      isPublic,
    } = req.body;

    const content = new EducationalContent({
      title,
      description,
      fileUrl,
      fileType,
      uploadBy: req.user.id,
      relatedSymptoms,
      treatmentStage,
      clinicalTags,
      isPublic,
    });

    await content.save();

    await analyzeAndNotifyContent(content);

    res.status(201).json({
      ok: true,
      content,
      message: "Contenido educativo subido exitosamente.",
    });
  } catch (error) {
    console.error("[Error] Error al subir contenido educativo:", error);
    res
      .status(500)
      .json({ ok: false, message: "No se pudo subir el contenido." });
  }
};


export const getDoctorUploads = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const {
      page = 1,
      limit = 10,
      search = "",
      treatmentStage,
      fileType,
    } = req.query;

    const query = {
      uploadBy: doctorId,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (treatmentStage) {
      query.treatmentStage = treatmentStage;
    }

    if (fileType) {
      query.fileType = fileType;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [uploads, total] = await Promise.all([
      EducationalContent.find(query)
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
  } catch (error) {
    console.error("[Error] Error al obtener contenidos del doctor:", error);
    res
      .status(500)
      .json({ ok: false, message: "No se pudo obtener los contenidos." });
  }
};

export const deleteEducationalContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const doctorId = req.user.id;

    const content = await EducationalContent.findOne({ _id: contentId, uploadBy: doctorId });

    if (!content) {
      return res.status(404).json({ ok: false, message: "Contenido no encontrado o sin permisos." });
    }

    await EducationalContent.findByIdAndDelete(contentId);

    res.status(200).json({
      ok: true,
      message: "Contenido eliminado correctamente.",
    });
  } catch (error) {
    console.error("[Error] Error al eliminar contenido:", error);
    res.status(500).json({ ok: false, message: "No se pudo eliminar el contenido." });
  }
};

export const getPublicEducationalContent = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      treatmentStage,
      clinicalTag,
    } = req.query;

    const query = {
      isPublic: true,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (treatmentStage) {
      query.treatmentStage = treatmentStage;
    }

    if (clinicalTag) {
      query.clinicalTags = clinicalTag;
    }

    const total = await EducationalContent.countDocuments(query);
    const contents = await EducationalContent.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      ok: true,
      contents,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[Error] Error al obtener contenidos públicos:", error);
    res.status(500).json({
      ok: false,
      message: "No se pudo obtener el contenido público.",
    });
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

    const wasPrivate = !content.isPublic;

    const fieldsToUpdate = req.body;
    Object.assign(content, fieldsToUpdate);
    await content.save();

    if (wasPrivate && content.isPublic) {
      await analyzeAndNotifyContent(content);
    }

    res.status(200).json({
      ok: true,
      message: "Contenido actualizado correctamente.",
      content,
    });
  } catch (error) {
    console.error("[Error] Error al actualizar contenido:", error);
    res.status(500).json({
      ok: false,
      message: "No se pudo actualizar el contenido.",
    });
  }
};


export const getEducationalContentById = async (req, res) => {
  try {
    const contentId = req.params.id;

    const content = await EducationalContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        ok: false,
        message: "Contenido no encontrado.",
      });
    }

    res.status(200).json({
      ok: true,
      content,
    });
  } catch (error) {
    console.error("[Error] Error al obtener contenido:", error);
    res.status(500).json({
      ok: false,
      message: "No se pudo obtener el contenido.",
    });
  }
};
