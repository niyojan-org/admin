import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Icon404 from '@/assets/svg/404';

const Error404 = () => {
  return (
    <section className="relative flex flex-col items-center justify-center h-dvh" role="main">
      <div className="max-w-md w-full flex flex-col items-center">
        <Icon404 />
        <h1 className="text-4xl font-extrabold mb-4 text-center text-primary">Oops! Page Not Found</h1>
        <p className="text-center mb-6 text-muted-foreground max-w-xs">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs">
          <Button asChild size={'lg'}>
            <Link href="/" className="" tabIndex={0}>
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size={'lg'}>
            <Link href="/contact" className="" tabIndex={0}>
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Error404;
