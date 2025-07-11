import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Input,
  Spinner,
  Chip,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Slider,
  Switch,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useLedStripStore } from '../stores/ledstrip-store';
import { useEffect } from 'react';
import { getConnectionUpdates } from '@mnlphlp/plugin-blec';
import { addToast } from '@heroui/react';
import { connect, disconnect } from '@mnlphlp/plugin-blec';
import { bleError } from '../utils/error';
export function LEDStripManager() {
  const [ledCount, setLedCount] = useState(60);
  const [autoConnect, setAutoConnect] = useState(false);

  
  const scanForStrip = useLedStripStore((state) => state.scanForStrip);
  const ledStrips = useLedStripStore((state) => state.ledStrips);
  const isScanning = useLedStripStore((state) => state.isScanning);
  const setSelectedStrip = useLedStripStore((state) => state.setSelectedStrip);
  const selectedStrip = useLedStripStore((state) => state.selectedStrip);
  const updateSelectedStrip = useLedStripStore((state) => state.updateSelectedStrip);
  const brightness = useLedStripStore((state) => state.brightness);
  useEffect(() => {
    getConnectionUpdates((state) => {
      if (state) {
        updateSelectedStrip({ isConnected: true });
        addToast({
          title: 'LED',
          color: 'success',
          description: 'Led connected',
          timeout: 3000,
        });
      }
    });
  }, []);

  const handleConnect = async () => {
    if (!selectedStrip) return;
      try {
        await connect(selectedStrip.address, () => {
        updateSelectedStrip({ isConnected: false });
        bleError('Led Disconected');
        });
      } catch (error: unknown) {
        console.log('test');
        const message = String(error);
        bleError(message);
      }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error: unknown) {
      console.log('test');
      const message = String(error);
      bleError(message);
    }
  };

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardBody className='space-y-6'>
        <h2 className='text-2xl font-semibold'>LED Strip Manager</h2>

        <div className='flex items-center gap-4'>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='flat'
                color='primary'
                startContent={<Icon icon='lucide:bluetooth' />}
                endContent={<Icon icon='lucide:chevron-down' />}
              >
                {selectedStrip ? selectedStrip.name : 'Select LED Strip'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label='LED Strip Selection'>
              {ledStrips.map((strip) => (
                <DropdownItem
                  key={strip.address}
                  startContent={
                    <Icon
                      icon={strip.isConnected ? 'lucide:wifi' : 'lucide:wifi-off'}
                      className={strip.isConnected ? 'text-success' : 'text-danger'}
                    />
                  }
                  onPress={() => setSelectedStrip(strip)}
                >
                  {strip.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            color='primary'
            startContent={
              <Icon
                icon={isScanning ? 'lucide:loader-2' : 'lucide:search'}
                className={isScanning ? 'animate-spin' : ''}
              />
            }
            onPress={scanForStrip}
            isDisabled={isScanning}
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </Button>
        </div>

        {selectedStrip && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-default-600'>Connection Status:</span>
              <div className='flex items-center gap-2'>
                <span className={selectedStrip.isConnected ? 'text-success' : 'text-danger'}>
                  {selectedStrip.isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <Icon
                  icon={selectedStrip.isConnected ? 'lucide:wifi' : 'lucide:wifi-off'}
                  className={selectedStrip.isConnected ? 'text-success' : 'text-danger'}
                />
              </div>
            </div>

            <Button
              color={selectedStrip.isConnected ? 'danger' : 'primary'}
              variant='flat'
              startContent={
                <Icon icon={selectedStrip.isConnected ? 'lucide:power-off' : 'lucide:plug'} />
              }
              onPress={selectedStrip.isConnected ? handleDisconnect : handleConnect}
              className='w-full'
            >
              {selectedStrip.isConnected ? 'Disconnect' : 'Connect to LED Strip'}
            </Button>

            <Tooltip
              content={
                selectedStrip.isConnected ? 'Adjust brightness' : 'Connect to adjust brightness'
              }
            >
              <div>
                <Slider
                  label='Brightness'
                  step={1}
                  maxValue={100}
                  minValue={0}
                  value={brightness}
                  className='max-w-md'
                />
              </div>
            </Tooltip>

            <Input
              type='number'
              label='Number of LEDs'
              placeholder='Enter the number of LEDs'
              value={ledCount.toString()}
              onValueChange={(value) => setLedCount(parseInt(value) || 0)}
              disabled={!selectedStrip.isConnected}
              startContent={
                <Icon
                  icon='lucide:lightbulb'
                  className='text-default-400 pointer-events-none flex-shrink-0'
                />
              }
            />

            <div className='flex justify-between items-center'>
              <span className='text-default-600'>Auto-connect on startup</span>
              <Switch
                isSelected={autoConnect}
                onValueChange={setAutoConnect}
                disabled={!selectedStrip.isConnected}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
