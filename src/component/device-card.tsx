import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Dropdown,
  DropdownTrigger,
  //   Button,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { CardPropreties } from '../stores/card-store';
import { useCardStore } from '../stores/card-store';
import { useNavigate } from 'react-router-dom';
import { useGitLabStore } from '../stores/gitlab-store';
import { ChooseCard } from './choose-card';
import { CardProgressBar } from './card-progress-bar';
import { getStatusColor, getJobTypeStatus, getStatusLedColor } from '../utils/job-utilities';
import { CARD_TYPE_ARRAY } from '../utils/global-variable';
import { CardType } from '../utils/global-variable';
import { useEffect } from 'react';
import { setLedColors } from '../utils/led-control';
import { LED_COLOR } from '../utils/job-utilities';

export function DeviceCard({ id, onBoardPosition }: CardPropreties) {
  const useGetCard = useCardStore((state) => state.getCard);
  const gitLabData = useGitLabStore((State) => State.gitLabData);
  const card = useGetCard(id);
  const navigate = useNavigate();
  const useUpdateCard = useCardStore((state) => state.updateCard);
  const updateCard = (patch: Partial<CardPropreties>) => {
    useUpdateCard(id, patch);
  };
  const type = card?.type;
  const pipelinesRecord = type && gitLabData?.[type] ? gitLabData[type] : {};
  const pipelineList = Object.values(pipelinesRecord);
  const latestPipeline = pipelineList.at(-1);
  const status = latestPipeline
    ? getJobTypeStatus(latestPipeline, ['build', 'test', 'test_offline'])
    : undefined;
  const borederColor = status ? getStatusColor(status) : undefined;
  const isLoading = useGitLabStore((state) => state.isLoading);
  const date = latestPipeline ? new Date(latestPipeline.updated_at) : undefined;

  useEffect(() => {
    if (!card || !status) {
      setLedColors(onBoardPosition, LED_COLOR.black);
      return;
    }

    const ledColor = getStatusLedColor(status);
    setLedColors(onBoardPosition, ledColor);
  }, [borederColor]);
  if (!card) return;

  const openPipelineDetails = (deviceId: string, deviceName: string) => {
    navigate('/pipelines', {
      state: {
        deviceId,
        deviceName,
        isOpen: true,
      },
    });
  };

  if (!type) {
    setLedColors(onBoardPosition, LED_COLOR.black);
    return (
      <Card
        isPressable={false}
        className='  flex flex-col h-full border-gray-500 border-1 justify-center items-center'
      >
        <ChooseCard id={id} onBoardPosition={onBoardPosition} />
      </Card>
    );
  }

  if (isLoading && Object.keys(gitLabData).length === 0) {
    return (
      <Card className='flex flex-col h-full'>
        <Skeleton className='p-3 gap-2'></Skeleton>
        <Divider className='my-1' />
        <div className='flex-1 flex justify-center items-center'>
          <Spinner></Spinner>
        </div>
      </Card>
    );
  }

  if (!latestPipeline) {
    setLedColors(onBoardPosition, LED_COLOR.black);
    return (
      <Card
        isPressable={false}
        className='  flex flex-col h-full border-gray-500 border-1 justify-center items-center'
      >
        <div className='mb-5 w-full text-center'>
          no pipeline found for
          <br /> {type}
        </div>
        <ChooseCard id={id} onBoardPosition={onBoardPosition} />
      </Card>
    );
  }

  return (
    <Card
      className={`flex flex-col h-full border-${borederColor} border-1 cursor-pointer`}
      isPressable
      onPress={() => openPipelineDetails(id, type)}
    >
      <CardBody className='p-2 gap-1'>
        <div className='flex justify-between items-center'>
          <h3 className='text-sm font-semibold'>{type}</h3>
          <Dropdown>
            <DropdownTrigger>
              <span
                role='button'
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className='p-2.5 hover:bg-gray-700 opacity-70 rounded-xl'
              >
                <Icon icon='lucide:arrow-down' />
              </span>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Types de composants'
              onAction={(key) => updateCard({ type: key as CardType })}
            >
              {CARD_TYPE_ARRAY.map((type) => (
                <DropdownItem key={type === 'no card' ? '' : type}>{type}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <Divider className='mg-0' />
        {/* Build Result */}
        <CardProgressBar
          type={'build'}
          pipelineJobs={latestPipeline}
          pipelineStatus={latestPipeline.status}
        />
        {/* test Result */}
        <CardProgressBar
          type={'test'}
          pipelineJobs={latestPipeline}
          pipelineStatus={latestPipeline.status}
        />
        {/* test-offiline Result */}
        <CardProgressBar
          type={'test_offline'}
          pipelineJobs={latestPipeline}
          pipelineStatus={latestPipeline.status}
        />
      </CardBody>
      <CardFooter className='p-2 border-t border-content2 justify-between'>
        <div className='flex items-center'>
          <Icon icon='icon-park-outline:branch-two' className='text-default-400 mr-1' />
          <span className='text-tiny text-default-400'>{Number(latestPipeline.id)}</span>
        </div>
        {date && (
          <span className='text-tiny text-default-400'>{date.toLocaleDateString('fr-FR')}</span>
        )}
      </CardFooter>
    </Card>
  );
}
