import Image from "next/image";

export default function Home() {
    return (
        <div>
            <div className="">
                <Image
                    src="/app/assets/background.jpg"
                    alt="Image description"
                    width={500}
                    height={500}
                />
            </div>
            <div>
                <h1>Extraordinary Natural and Cultural Charm</h1>
            </div>
        </div>
    );
}
