import { useCallback, useEffect, useState } from "react";
import Button from "../../components/button";
import { useAuthContext } from "../../contexts/auth.context";
import favoriteService from "../../services/favorite.service";
import { displayMsg } from "../../utils/toast";

interface FavoritePartProps {
    prestationId: string;
}

export default function FavoritePart({ prestationId }: FavoritePartProps) {
    const { isConnected } = useAuthContext();

    const [isLiked, setIsLiked] = useState(false);

    const fetchIsLiked = useCallback(async () => {
        if (!isConnected) return;

        try {
            const { isFavorite } = await favoriteService.getIsLiked(
                prestationId
            );
            setIsLiked(isFavorite);
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    }, [prestationId]);

    const toggleLike = useCallback(async () => {
        try {
            if (!isConnected)
                throw new Error("You must be connected to like a prestation");
            const { message } = await favoriteService.toggleFavorite(
                prestationId
            );
            if (message === "ADDED") {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    }, [prestationId]);

    useEffect(() => {
        fetchIsLiked();
    }, [prestationId]);

    return (
        <>
            <Button
                visual={isLiked ? "danger" : "primary"}
                onClick={toggleLike}
                className="w-full ml-auto items-center"
            >
                {!isLiked ? (
                    <>
                        Save to favorites{" "}
                        <svg
                            width="31"
                            height="20"
                            viewBox="0 0 40 39"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M39.8689 14.6907C39.7188 14.208 39.4294 13.7819 39.0381 13.4671C38.6468 13.1523 38.1713 12.9632 37.6729 12.9241L26.8639 11.9782C26.7985 11.9717 26.7361 11.9474 26.6833 11.9079C26.6305 11.8684 26.5893 11.8151 26.564 11.7537L22.3411 1.56656C22.1455 1.10184 21.8193 0.705565 21.403 0.427033C20.9867 0.148501 20.4987 0 19.9997 0C19.5006 0 19.0126 0.148501 18.5963 0.427033C18.18 0.705565 17.8538 1.10184 17.6582 1.56656L13.4353 11.7537C13.41 11.8151 13.3688 11.8684 13.316 11.9079C13.2632 11.9474 13.2008 11.9717 13.1354 11.9782L2.32637 12.9241C1.82799 12.9632 1.35255 13.1523 0.961211 13.4671C0.56987 13.7819 0.280522 14.208 0.130384 14.6907C-0.0286254 15.174 -0.0425151 15.6942 0.0904712 16.1855C0.223457 16.6768 0.497349 17.1171 0.877526 17.4509L9.07792 24.692C9.12813 24.7371 9.16542 24.7951 9.18589 24.8599C9.20636 24.9246 9.20925 24.9937 9.19426 25.06L6.72923 35.8269C6.61433 36.3226 6.64711 36.8416 6.82344 37.3185C6.99978 37.7954 7.31175 38.2086 7.71997 38.5061C8.12186 38.8063 8.6034 38.9776 9.10244 38.998C9.60147 39.0183 10.0951 38.8867 10.5195 38.6202L19.8106 32.9157C19.8652 32.8815 19.9282 32.8634 19.9924 32.8634C20.0566 32.8634 20.1196 32.8815 20.1742 32.9157L29.4653 38.6202C29.8941 38.886 30.3911 39.0172 30.8935 38.9974C31.396 38.9775 31.8813 38.8074 32.2884 38.5086C32.6954 38.2097 33.0059 37.7955 33.1806 37.3183C33.3553 36.841 33.3864 36.322 33.2701 35.8269L30.8123 25.0563C30.7973 24.9901 30.8002 24.9209 30.8207 24.8562C30.8412 24.7914 30.8784 24.7335 30.9287 24.6883L39.1291 17.4472C39.5073 17.1129 39.7793 16.6728 39.911 16.1823C40.0426 15.6917 40.028 15.1728 39.8689 14.6907ZM37.6875 15.78L29.4871 23.0211C29.1377 23.3289 28.8779 23.7273 28.7356 24.1735C28.5934 24.6197 28.5741 25.0967 28.68 25.5532L31.1377 36.3237C31.1559 36.3961 31.1519 36.4723 31.1262 36.5423C31.1006 36.6123 31.0545 36.6728 30.9941 36.7157C30.9394 36.76 30.8722 36.7855 30.8023 36.7884C30.7323 36.7914 30.6632 36.7717 30.6051 36.7322L21.314 31.0277C20.9178 30.784 20.4632 30.6551 19.9997 30.6551C19.5361 30.6551 19.0815 30.784 18.6853 31.0277L9.39423 36.7322C9.33608 36.7717 9.267 36.7914 9.19703 36.7884C9.12707 36.7855 9.05987 36.76 9.0052 36.7157C8.94481 36.6728 8.89873 36.6123 8.87308 36.5423C8.84743 36.4723 8.84343 36.3961 8.86159 36.3237L11.3193 25.5532C11.4252 25.0967 11.4059 24.6197 11.2637 24.1735C11.1215 23.7273 10.8616 23.3289 10.5122 23.0211L2.31182 15.78C2.25574 15.7318 2.21546 15.6674 2.19631 15.5954C2.17715 15.5235 2.18004 15.4473 2.20457 15.377C2.22293 15.3071 2.26273 15.2448 2.31826 15.1992C2.37379 15.1535 2.44218 15.1269 2.51361 15.1231L13.3245 14.1773C13.7873 14.1373 14.2305 13.97 14.606 13.6933C14.9816 13.4166 15.2752 13.0411 15.455 12.6076L19.6779 2.4204C19.7073 2.35718 19.7538 2.30371 19.812 2.26627C19.8703 2.22882 19.9379 2.20893 20.0069 2.20893C20.0759 2.20893 20.1435 2.22882 20.2018 2.26627C20.2601 2.30371 20.3066 2.35718 20.336 2.4204L24.5443 12.6076C24.7236 13.0401 25.016 13.4149 25.3902 13.6915C25.7644 13.9681 26.206 14.136 26.6676 14.1773L37.4784 15.1231C37.5499 15.1269 37.6182 15.1535 37.6738 15.1992C37.7293 15.2448 37.7691 15.3071 37.7875 15.377C37.8128 15.4466 37.8169 15.5223 37.799 15.5942C37.7812 15.6661 37.7423 15.7309 37.6875 15.78Z"
                                fill="white"
                            />
                        </svg>
                    </>
                ) : (
                    <svg
                        width="31"
                        height="20"
                        viewBox="0 0 44 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9.92927 40.8442C8.86777 41.3854 7.66328 40.437 7.87777 39.2261L10.1603 26.2979L0.472046 17.1251C-0.432702 16.2669 0.0375468 14.698 1.25029 14.5286L14.7198 12.6262L20.7257 0.799473C21.2675 -0.266491 22.7332 -0.266491 23.275 0.799473L29.281 12.6262L42.7504 14.5286C43.9632 14.698 44.4334 16.2669 43.5259 17.1251L33.8405 26.2979L36.1229 39.2261C36.3374 40.437 35.1329 41.3854 34.0715 40.8442L21.9962 34.678L9.92927 40.8442Z"
                            fill="white"
                        />
                    </svg>
                )}
            </Button>
        </>
    );
}
