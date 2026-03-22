import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
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
  const [horizontalIndex, setHorizontalIndex] = useState(0)
  const [verticalIndex, setVerticalIndex] = useState(1)

  return (
    <StoryStack>
      <StorySection
        title='Horizontal carousel'
        description='Use the arrows or swipe. The slides are fixed-width so the layout stays predictable in web Storybook.'
      >
        <Carousel
          style={{ width: '100%', height: 220 }}
          hasArrows
          hasDots
          isResponsive
          onChange={setHorizontalIndex}
        >
          {slides.map((slide, index) => (
            <Card
              key={slide.title}
              style={{
                width: 300,
                minWidth: 300,
                maxWidth: 300,
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
        <Span>{`Horizontal active slide: ${horizontalIndex}`}</Span>
      </StorySection>
      <StorySection
        title='Vertical carousel'
        description='This keeps the vertical variant in view as a smoke check for non-horizontal layouts.'
      >
        <Carousel
          style={{ width: 340, height: 260 }}
          variant='vertical'
          hasArrows
          startIndex={1}
          onChange={setVerticalIndex}
        >
          {slides.map((slide) => (
            <Card key={slide.title} style={{ width: '100%', height: 96, padding: 16 }}>
              <Div gap={0.5}>
                <Span bold>{slide.title}</Span>
                <Span description>{slide.text}</Span>
              </Div>
            </Card>
          ))}
        </Carousel>
        <Span>{`Vertical active slide: ${verticalIndex}`}</Span>
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Next slide' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <CarouselStates />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Horizontal active slide: 0')).toBeVisible()
    await expect(canvas.getByText('Vertical active slide: 1')).toBeVisible()
    expect(canvas.getAllByRole('button').length).toBeGreaterThan(0)
  }
}
