import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-red-500">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="bg-green-400 py-3 px-6 text-white rounded-xl">
        Return Home
      </Link>
    </div>
  );
}
