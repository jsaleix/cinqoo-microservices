import { Link } from "react-router-dom";
import { PrestationItemList } from "../../../interfaces/prestation";

interface ViewPrestationCardProps {
    prestation: PrestationItemList;
}

export default function ViewPrestationCard({
    prestation,
}: ViewPrestationCardProps) {
    const description =
        prestation.description.length > 100
            ? prestation.description.slice(0, 100) + "..."
            : prestation.description;
    return (
        <Link
            to={`/prestations/${prestation._id}`}
            className="card w-72 bg-base-100 shadow-xl border border-2 overflow-hidden duration-500 hover:opacity-75"
        >
            <figure
                style={{
                    height: "150px",
                    overflow: "hidden",
                    objectFit: "cover",
                }}
            >
                <img
                    src={prestation.image}
                    className="w-full h-full object-cover"
                    alt="Shoes"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title capitalize">
                    {prestation.name} - {prestation.price}$
                </h2>
                <p>{description}</p>
            </div>
        </Link>
    );
}
