function Title({ icon, title }) {
  return (
    <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex flex-col lg:flex-row items-center lg:items-start lg:justify-start justify-center text-center lg:text-left gap-3">
      <span className="inline-flex items-center gap-3">
        <i
          className={`fas ${icon} text-2xl lg:text-2xl bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent`}
        ></i>
        <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
          {title}
        </span>
      </span>
    </h2>
  );
}

export default Title;
