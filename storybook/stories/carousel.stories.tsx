import type { Meta, StoryObj } from '@storybook/react-native'
import { Card, Carousel, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const slides = [
  {
    title: 'Profile step',
    text: 'Collect name, contact details, and a photo.'
  },
  {
    title: 'Waiting step',
    text: 'Participants wait for the event to start.'
  },
  {
    title: 'Results step',
    text: 'Show mutual matches and one-sided likes.'
  }
]

function CarouselStates () {
  return (
    <StoryStack>
      <StorySection
        title='Horizontal carousel'
        description='Use the arrows or swipe. The slides are fixed-width so the layout stays predictable in web Storybook.'
      >
        <Carousel style={{ width: '100%', height: 220 }} hasArrows hasDots isResponsive>
          {slides.map((slide, index) => (
            <Card
              key={slide.title}
              style={{
                width: 300,
                height: 160,
                padding: 20,
                backgroundColor: index === 1 ? 'var(--color-bg-main-subtle-alt)' : undefined
              }}
            >
              <Div gap={0.75}>
                <Span h4>{slide.title}</Span>
                <Span description>{slide.text}</Span>
              </Div>
            </Card>
          ))}
        </Carousel>
      </StorySection>
      <StorySection
        title='Vertical carousel'
        description='This keeps the vertical variant in view as a smoke check for non-horizontal layouts.'
      >
        <Carousel style={{ width: 340, height: 260 }} variant='vertical' hasArrows startIndex={1}>
          {slides.map((slide) => (
            <Card key={slide.title} style={{ width: '100%', height: 96, padding: 16 }}>
              <Div gap={0.5}>
                <Span bold>{slide.title}</Span>
                <Span description>{slide.text}</Span>
              </Div>
            </Card>
          ))}
        </Carousel>
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Navigation/Carousel',
  component: CarouselStates,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof CarouselStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <CarouselStates />
}
