import { type ReactNode } from 'react'
import { Text, View, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'
import Icon from '@startupjs-ui/icon'
import Menu from '@startupjs-ui/menu'
import Link from '@startupjs-ui/link'

import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'

export interface DropdownItemProps {
  /** Custom styles applied to the wrapper */
  style?: StyleProp<ViewStyle>
  /** Navigation target (renders as Link when provided) */
  to?: any
  /** Item label */
  label?: string
  /** Item value reported to Dropdown.onChange */
  value?: string | number
  /** Optional icon displayed in Menu.Item (popover variant) */
  icon?: any
  /** Disable item interactions */
  disabled?: boolean
  /** Custom press handler (bypasses Dropdown.onChange) */
  onPress?: () => void
  /** Custom content when used as a pure/custom item */
  children?: ReactNode
  /** Test id forwarded to the interactive root (menu row or touchable wrapper) */
  testID?: string
  /** @private Active value injected by Dropdown */
  _activeValue?: any
  /** @private Selected index for keyboard navigation */
  _selectIndexValue?: number
  /** @private Variant injected by Dropdown */
  _variant?: 'list' | 'buttons' | 'popover' | 'pure'
  /** @private Style for active item injected by Dropdown */
  _styleActiveItem?: StyleProp<ViewStyle>
  /** @private Change handler injected by Dropdown */
  _onChange?: (value: any) => void
  /** @private Dismiss handler injected by Dropdown */
  _onDismissDropdown?: () => void
  /** @private Item index injected by Dropdown */
  _index?: number
  /** @private Items count injected by Dropdown */
  _childrenLength?: number
}

function DropdownItem ({
  style,
  to,
  label,
  value,
  icon,
  disabled,
  onPress,
  children,
  testID,
  _activeValue,
  _selectIndexValue,
  _variant,
  _styleActiveItem,
  _onChange,
  _onDismissDropdown,
  _index,
  _childrenLength
}: DropdownItemProps): ReactNode {
  const isPure = _variant === 'pure'

  const handlePress = () => {
    if (disabled) return

    if (onPress) {
      onPress()
      _onDismissDropdown && _onDismissDropdown()
    } else {
      _onChange && _onChange(value)
    }
  }

  if (_variant === 'popover' && !isPure) {
    return pug`
      Menu.Item(
        to=to
        style=style
        active=_activeValue === value
        disabled=disabled
        styleName={ selectMenu: _selectIndexValue === _index }
        onPress=handlePress
        icon=icon
        testID=testID
        role='option'
        aria-selected=(_activeValue === value)
        aria-label=label
      )= label
    `
  }

  const Wrapper: any = to ? Link : TouchableOpacity
  return pug`
    Wrapper(
      to=to
      style=style
      onPress=handlePress
      testID=testID
    )
      View.item(
        style=(!isPure && _activeValue === value) ? _styleActiveItem : undefined
        styleName=[!isPure && _variant, {
          active: !isPure && (_activeValue === value),
          itemUp: !isPure && (_index === 0),
          itemDown: !isPure && (_index === (_childrenLength || 0) - 1),
          selectMenu: _selectIndexValue === _index
        }]
      )
        if isPure
          = children
        else
          Text.itemText(styleName=[_variant, { active: _activeValue && _activeValue === value }])
            = label
          if _activeValue === value
            Icon.iconActive(styleName=_variant icon=faCheck)
  `
}

export default observer(themed('DropdownItem', DropdownItem))

css`
  .item.list {
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: var(--DropdownItem-border-width);
    border-bottom-color: var(--DropdownItem-border-color);
  }

  .item.buttons {
    justify-content: center;
    align-items: center;
    height: var(--DropdownItem-buttons-height);
    border-bottom-width: var(--DropdownItem-border-width);
    border-bottom-color: var(--DropdownItem-border-color);
  }

  .item.popover {
    padding: var(--DropdownItem-popover-padding);
  }

  .item.itemDown {
    border-bottom-width: 0;
  }

  .itemText.list {
    padding: var(--DropdownItem-text-padding);
  }

  .itemText.buttons {
    padding: var(--DropdownItem-text-padding);
  }

  .itemText.active {
    color: var(--DropdownItem-active-color);
  }

  .iconActive.list {
    position: absolute;
    top: var(--DropdownItem-icon-top);
    right: var(--DropdownItem-icon-inset);
    width: var(--DropdownItem-icon-size);
    height: var(--DropdownItem-icon-size);
  }

  .iconActive.buttons {
    position: absolute;
    top: var(--DropdownItem-icon-top);
    left: var(--DropdownItem-icon-inset);
    width: var(--DropdownItem-icon-size);
    height: var(--DropdownItem-icon-size);
  }

  .selectMenu {
    background-color: var(--DropdownItem-selected-bg);
  }
`
