import type { PageProps } from '@/types';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';

type Convo = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

interface ConvosHubProps extends PageProps {
  convos: Convo[];
}

export default function ConvosHub({ auth, ziggy, convos }: ConvosHubProps) {
  return (
    <AuthenticatedLayout user={auth.user}>
      {convos.map((convo, i) => (
        <ConvoPreview key={convo.id} convo={convo} />
      ))}
    </AuthenticatedLayout>
  );
}

export function ConvoPreview({ convo }: { convo: Convo }) {
  return (
    <div className='p-6 flex space-x-2'>

      <div className='flex-1'>
        <div className='flex justify-between items-center'>
          <div>
            <p className='mb-1 text-lg text-gray-900'>{convo.title}</p>
            <small className='text-sm text-gray-600'>
              {new Date(convo.created_at).toLocaleString()}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
