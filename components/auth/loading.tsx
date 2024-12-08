import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col gap-y-4 justify-center items-center">
      <Image
        src="/loading.svg"
        width={120}
        height={120}
        alt="Logo"
        className="animate-pulse duration-700"
        priority
      />
    </div>
  );
}
