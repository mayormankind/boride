import Image from "next/image"

type logoProps = {
    type?: "light" | "dark";
}
export const BorideLogo = ({type}:logoProps) =>{
    return(
        <div className="flex justify-center mb-6">
            <Image src={type==="light"? "/img/boride-white1.PNG" : "/img/boride-black1.PNG"} width={150} height={40} alt="Boride" className="opacity-90"/>
        </div>
    )
}