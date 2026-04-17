export default function LearnTkmSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-2xl sm:text-3xl font-bold">ТКМ</h1>
      </div>

      <div className="w-full -mx-4 sm:-mx-8 md:-mx-16">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdB429Yr16E5rsm-MMxd4BtE3zq9Bxk-urv7pHDhV8iByU4yQ/viewform?embedded=true"
          width="100%"
          height="860"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          style={{ display: "block" }}
        >
          Загрузка…
        </iframe>
      </div>
    </div>
  );
}