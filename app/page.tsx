import { redirect } from 'next/navigation';

const Page = () => {
  redirect('/events');
};

export default Page;

// import { FullPageLoader } from '@/components/ui/full-page-loader';

// const Page = () => {
//   return <FullPageLoader />;
// };

// export default Page;
