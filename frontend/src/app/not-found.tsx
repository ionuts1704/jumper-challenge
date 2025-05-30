import { Link } from '@mui/material';
import { paths } from '@/config/paths';

const NotFoundPage = () => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href={paths.home.getHref()}>Go to Home</Link>
    </div>
  );
};

export default NotFoundPage;
