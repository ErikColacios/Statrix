import Link from "next/link";

export default async function Home() {


  return (
    <div className="flex h-full bg-[url('/staticImages/bioshock.jpg')] bg-cover">
      <div className="bg-black/90 w-1/2 text-white flex flex-col justify-center pl-24">
        <h1 className="text-6xl bold">VIDEGOGAME TRACKER</h1>
        <p className="text-xl">Welcome to the homepage</p>
        <p className="text-xl mt-8 mb-8">Create your first list!</p>
        <div>
          <Link href={"newVideogameList"} className="text-4xl border-2 p-4 transition hover:bg-white hover:text-black">START NOW</Link>
        </div>
      </div>
    </div>
  );
}
