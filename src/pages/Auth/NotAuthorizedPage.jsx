import { useClerk } from "@clerk/react";

function NotAuthorizedPage() {
  const { signOut } = useClerk();

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Compte en attente d'autorisation</h1>
        <p>
          Votre compte est bien connecté, mais n'est pas encore autorisé à accéder à
          cette application. Contactez le cabinet pour faire le nécessaire.
        </p>
        <button onClick={() => signOut({ redirectUrl: "/login" })}>
          Se connecter avec un autre compte
        </button>
      </div>
    </div>
  );
}

export default NotAuthorizedPage;