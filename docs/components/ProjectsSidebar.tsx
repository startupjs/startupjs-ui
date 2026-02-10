import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native'
import { type ExternalPathString, Link } from 'expo-router'

const SIDEBAR_WIDTH = 48
const BUTTON_SIZE = 48
const TABLET_BREAKPOINT = 768

interface Project {
  id: string
  label: string
  fullName: string
  url: string
  color: string
  activeBg: string
  hoverBg: string
}

const PROJECTS: Project[] = [
  {
    id: 'startupjs',
    label: 'SJS',
    fullName: 'StartupJS fullstack framework',
    url: 'https://startupjs-ui.dev.dmapper.co/',
    color: '#5f6ff6',
    activeBg: 'rgba(95,111,246,0.25)',
    hoverBg: 'rgba(99,102,241,0.1)'
  },
  {
    id: 'cssx',
    label: 'CSSX',
    fullName: 'CSSX styling',
    url: 'https://cssx.dev/',
    color: '#2eb85c',
    activeBg: 'rgba(46,184,92,0.25)',
    hoverBg: 'rgba(46,184,92,0.1)'
  },
  {
    id: 'teamplay',
    label: 'TP',
    fullName: 'TeamPlay ORM',
    url: 'https://teamplay.dev/',
    color: '#f56a44',
    activeBg: 'rgba(245,106,68,0.25)',
    hoverBg: 'rgba(249,115,22,0.1)'
  },
  {
    id: 'ui',
    label: 'UI',
    fullName: 'StartupJS UI Library',
    url: 'https://ui.startupjs.org/',
    color: '#d04ecb',
    activeBg: 'rgba(168,85,247,0.25)',
    hoverBg: 'rgba(168,85,247,0.1)'
  }
]

const ACTIVE_PROJECT_ID = 'ui'

// --- Tooltip subcomponent (shown on hover) ---

function Tooltip ({ text, visible, colorScheme }: { text: string, visible: boolean, colorScheme: string }): ReactNode {
  if (!visible) return null
  const isDark = colorScheme === 'dark'
  return (
    <View
      style={[
        styles.tooltip,
        isDark ? styles.tooltipDark : styles.tooltipLight
      ]}
    >
      <Text
        style={[
          styles.tooltipText,
          { color: isDark ? '#e0e0e0' : '#242424' }
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  )
}

// --- ProjectButton subcomponent ---

function ProjectButton ({ project, isActive, colorScheme }: { project: Project, isActive: boolean, colorScheme: string }): ReactNode {
  const [isHover, setIsHover] = useState(false)
  const onHoverIn = useCallback(() => { setIsHover(true) }, [])
  const onHoverOut = useCallback(() => { setIsHover(false) }, [])
  const isDark = colorScheme === 'dark'

  const buttonBg = isActive
    ? project.activeBg
    : isHover
      ? project.hoverBg
      : 'transparent'

  const textColor = isActive
    ? (isDark ? '#ffffff' : '#000000')
    : project.color

  const buttonStyle = StyleSheet.flatten([styles.button, { backgroundColor: buttonBg }])
  return (
    <Link asChild href={project.url as ExternalPathString} accessibilityLabel={project.fullName}>
      <Pressable
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        style={buttonStyle}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{project.label}</Text>
        <Tooltip text={project.fullName} visible={isHover} colorScheme={colorScheme} />
      </Pressable>
    </Link>
  )
}

// --- Main ProjectsSidebar component ---

export default function ProjectsSidebar ({ colorScheme }: { colorScheme?: string | null }): ReactNode {
  const scheme = colorScheme ?? 'light'
  const isDark = scheme === 'dark'

  const [isTablet, setIsTablet] = useState(() => Dimensions.get('window').width >= TABLET_BREAKPOINT)

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsTablet(window.width >= TABLET_BREAKPOINT)
    })
    return () => { subscription.remove() }
  }, [])

  if (!isTablet) return null

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {PROJECTS.map(project => (
        <ProjectButton
          key={project.id}
          project={project}
          isActive={project.id === ACTIVE_PROJECT_ID}
          colorScheme={scheme}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SIDEBAR_WIDTH,
    alignItems: 'stretch',
    zIndex: 100
  },
  containerLight: {
    backgroundColor: 'rgba(128,128,128,0.03)'
  },
  containerDark: {
    backgroundColor: 'rgba(128,128,128,0.03)'
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 13
  },
  tooltip: {
    position: 'absolute',
    left: SIDEBAR_WIDTH + 8,
    top: 7,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 1000
  },
  tooltipLight: {
    backgroundColor: '#f8f8f9',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)'
  },
  tooltipDark: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20
  }
})
