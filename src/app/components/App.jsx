import { useSession } from 'next-auth/react';

const App = () => {
  const { data: session } = useSession();

  return (
    <Navbar isLoggedIn={!!session} />
  );
};
