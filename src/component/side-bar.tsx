import {
  Button,
  Tooltip,
  Divider,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useGitLabStore } from '../stores/gitlab-store';
import { BRANCH_NAME_ARRAY } from '../utils/global-variable';

export function Sidebar() {
  const navigate = useNavigate();
  const fetchGitLabData = useGitLabStore((state) => state.fetchGitLabData);
  const apiLoading = useGitLabStore((state) => state.isLoading);
  const selectedBranch = useGitLabStore((state) => state.selectedBranch);
  const setSelectedBranch = useGitLabStore((state) => state.changeSelectedBranch);
  return (
    <div className='h-screen w-16 bg-content2 flex flex-col items-center py-4 border-r border-content3'>
      <Tooltip content='Dashboard' placement='right'>
        <Button
          isIconOnly
          variant='light'
          color='primary'
          className='mb-4'
          aria-label='Dashboard'
          onPress={() => navigate('/')}
        >
          <Icon icon='lucide:layout-dashboard' width={24} />
        </Button>
      </Tooltip>

      <Tooltip content='Test Bench' placement='right'>
        <Button
          isIconOnly
          variant='flat'
          color='primary'
          className='mb-4'
          aria-label='Test Bench'
          onPress={() => navigate('/board')}
        >
          <Icon icon='lucide:cpu' width={24} />
        </Button>
      </Tooltip>

      <Tooltip content='Analytics' placement='right'>
        <Button isIconOnly variant='light' className='mb-4' aria-label='Analytics'>
          <Icon icon='lucide:bar-chart-2' width={24} />
        </Button>
      </Tooltip>

      <Tooltip content='Settings' placement='right'>
        <Button
          isIconOnly
          variant='light'
          className='mb-4'
          aria-label='Settings'
          onPress={() => navigate('Settings')}
        >
          <Icon icon='lucide:settings' width={24} />
        </Button>
      </Tooltip>

      <Divider className='my-4 w-8' />
      <Dropdown placement='right'>
        <DropdownTrigger>
          <Button
            variant='light'
            color='default'
            isIconOnly
            startContent={<Icon icon='icon-park-outline:branch-two' />}
          ></Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Types de composants'
          selectedKeys={selectedBranch === null ? new Set() : new Set([selectedBranch])}
          selectionMode='single'
          onSelectionChange={(selectedKeys) => {
            const [key] = [...selectedKeys];
            //* key is undefined when i choose the already selected key so i leave early if this is the case
            if (!key) return;
            setSelectedBranch(String(key));
          }}
        >
          {BRANCH_NAME_ARRAY.map((branch) => (
            <DropdownItem key={branch}>{branch}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Tooltip content='Start All Tests' placement='right'>
        <Button
          isIconOnly
          variant='light'
          color='success'
          className='mb-4'
          aria-label='Start All Tests'
        >
          <Icon icon='lucide:play' width={24} />
        </Button>
      </Tooltip>

      <Tooltip content='Stop All Tests' placement='right'>
        <Button
          isIconOnly
          variant='light'
          color='danger'
          className='mb-4'
          aria-label='Stop All Tests'
        >
          <Icon icon='lucide:square' width={24} />
        </Button>
      </Tooltip>

      <div className='mt-auto flex flex-col items-center '>
        <Tooltip content='Refresh' placement='right'>
          <Button
            isIconOnly
            isLoading={apiLoading ? true : undefined}
            onPress={() => fetchGitLabData(selectedBranch, true)}
            className='mb-4'
            variant='light'
          >
            <Icon icon='material-symbols:clock-loader-60-sharp' width={24} />
          </Button>
        </Tooltip>
        <Tooltip content='Help' placement='right'>
          <Button isIconOnly variant='light' className='mb-4' aria-label='Help'>
            <Icon icon='lucide:help-circle' width={24} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
