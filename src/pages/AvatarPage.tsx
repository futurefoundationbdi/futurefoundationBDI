import AvatarSystem from "@/components/AvatarSystem";
import { useNavigate } from "react-router-dom";

const AvatarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* On appelle le composant et on lui dit que "retour" signifie aller à l'accueil */}
      <AvatarSystem onBack={() => navigate("/")} />
    </div>
  );
};

export default AvatarPage;
