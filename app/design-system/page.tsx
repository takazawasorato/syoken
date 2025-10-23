'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Select,
  Slider,
  Badge,
  Toast,
  Tabs,
  Tab,
  TabPanel,
  Spinner,
  EmptyState,
  ErrorState,
} from '@/components/ui';

/**
 * Design System Showcase
 *
 * Visual documentation and interactive examples of all design system components.
 * This page serves as a living style guide for developers.
 */

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('buttons');
  const [showToast, setShowToast] = useState(false);
  const [sliderValue, setSliderValue] = useState(500);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Design System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            商圏分析アプリケーションのデザインシステム - すべてのコンポーネントのライブドキュメント
          </p>
        </header>

        {/* Toast Demo */}
        {showToast && (
          <Toast
            type="success"
            message="これはトースト通知のデモです！"
            onClose={() => setShowToast(false)}
            duration={5000}
          />
        )}

        {/* Navigation Tabs */}
        <Card className="mb-8">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab
              value="buttons"
              label="Buttons"
              isActive={activeTab === 'buttons'}
              onClick={setActiveTab}
            />
            <Tab
              value="forms"
              label="Forms"
              isActive={activeTab === 'forms'}
              onClick={setActiveTab}
            />
            <Tab
              value="feedback"
              label="Feedback"
              isActive={activeTab === 'feedback'}
              onClick={setActiveTab}
            />
            <Tab
              value="layout"
              label="Layout"
              isActive={activeTab === 'layout'}
              onClick={setActiveTab}
            />
          </Tabs>
        </Card>

        {/* Buttons Tab */}
        <TabPanel value="buttons" activeValue={activeTab}>
          <div className="space-y-8">
            {/* Button Variants */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Button Variants</h2>
                <p className="text-gray-600 mt-2">Different button styles for various use cases</p>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <code className="text-sm text-gray-800">
                      {`<Button variant="primary">Primary</Button>`}
                    </code>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Button Sizes */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Button Sizes</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <code className="text-sm text-gray-800">
                      {`<Button size="lg">Large</Button>`}
                    </code>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Button States */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Button States</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Normal</Button>
                    <Button variant="primary" loading>
                      Loading
                    </Button>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                    <Button
                      variant="primary"
                      iconLeft={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      }
                    >
                      With Icon
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </TabPanel>

        {/* Forms Tab */}
        <TabPanel value="forms" activeValue={activeTab}>
          <div className="space-y-8">
            {/* Input Component */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Input Component</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <Input
                    label="Default Input"
                    placeholder="Enter text..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    helperText="This is a helper text"
                  />
                  <Input
                    label="Input with Icon"
                    placeholder="Enter address..."
                    icon={
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    }
                  />
                  <Input label="Error State" placeholder="Enter text..." error="This field is required" />
                  <Input label="Success State" placeholder="Enter text..." success="Input is valid!" />
                </div>
              </Card.Body>
            </Card>

            {/* Select Component */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Select Component</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <Select
                    label="Category"
                    options={[
                      { value: 'option1', label: 'Option 1', icon: '📦' },
                      { value: 'option2', label: 'Option 2', icon: '🎨' },
                      { value: 'option3', label: 'Option 3', icon: '🚀' },
                    ]}
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    helperText="Select an option from the dropdown"
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Slider Component */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Slider Component</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <Slider
                    label="Blue Slider"
                    min={100}
                    max={5000}
                    step={100}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    unit="m"
                    color="blue"
                  />
                  <Slider
                    label="Green Slider"
                    min={0}
                    max={100}
                    step={5}
                    value={50}
                    onChange={() => {}}
                    unit="%"
                    color="green"
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </TabPanel>

        {/* Feedback Tab */}
        <TabPanel value="feedback" activeValue={activeTab}>
          <div className="space-y-8">
            {/* Badges */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Badge Component</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="custom" customColor="#FF5733">
                      Custom
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge variant="success" dot>
                      With Dot
                    </Badge>
                    <Badge variant="error" size="sm">
                      Small
                    </Badge>
                    <Badge variant="info" size="lg">
                      Large
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Spinners */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Spinner Component</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Default Spinner</p>
                    <div className="flex items-center gap-6">
                      <Spinner size="sm" />
                      <Spinner size="md" />
                      <Spinner size="lg" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Dots Spinner</p>
                    <div className="flex items-center gap-6">
                      <Spinner variant="dots" size="sm" />
                      <Spinner variant="dots" size="md" />
                      <Spinner variant="dots" size="lg" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Pulse Spinner</p>
                    <div className="flex items-center gap-6">
                      <Spinner variant="pulse" size="sm" />
                      <Spinner variant="pulse" size="md" />
                      <Spinner variant="pulse" size="lg" />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Toast */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Toast Component</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <p className="text-gray-600">Click the button below to show a toast notification</p>
                  <Button variant="primary" onClick={() => setShowToast(true)}>
                    Show Toast
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Empty State */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Empty State Component</h2>
              </Card.Header>
              <Card.Body>
                <EmptyState
                  icon={
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                  title="No data available"
                  description="Start by creating your first analysis to see results here"
                  action={<Button variant="primary">Get Started</Button>}
                />
              </Card.Body>
            </Card>

            {/* Error State */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-gray-800">Error State Component</h2>
              </Card.Header>
              <Card.Body>
                <ErrorState
                  title="Something went wrong"
                  message="An error occurred while processing your request. Please try again."
                  onRetry={() => alert('Retry clicked')}
                  onDismiss={() => alert('Dismiss clicked')}
                />
              </Card.Body>
            </Card>
          </div>
        </TabPanel>

        {/* Layout Tab */}
        <TabPanel value="layout" activeValue={activeTab}>
          <div className="space-y-8">
            {/* Card Variants */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Card Variants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="default">
                  <Card.Body>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Default Card</h3>
                    <p className="text-gray-600">This is a default card with shadow and border</p>
                  </Card.Body>
                </Card>

                <Card variant="outlined">
                  <Card.Body>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Outlined Card</h3>
                    <p className="text-gray-600">This card has a border with no shadow</p>
                  </Card.Body>
                </Card>

                <Card variant="elevated">
                  <Card.Body>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Elevated Card</h3>
                    <p className="text-gray-600">This card has an elevated shadow</p>
                  </Card.Body>
                </Card>

                <Card variant="default" hoverable>
                  <Card.Body>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Hoverable Card</h3>
                    <p className="text-gray-600">Hover over this card to see the effect</p>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Card with Header and Footer */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Card Composition</h2>
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Card with Sections</h3>
                    <Badge variant="primary">New</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-600">
                    This card demonstrates the use of header, body, and footer sections. Each section is properly
                    separated and styled.
                  </p>
                </Card.Body>
                <Card.Footer>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary">Save</Button>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          </div>
        </TabPanel>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p>Design System v1.0.0 - 商圏分析アプリケーション</p>
          <p className="text-sm mt-2">
            For documentation, see{' '}
            <a href="/DESIGN_SYSTEM.md" className="text-blue-600 hover:underline">
              DESIGN_SYSTEM.md
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
