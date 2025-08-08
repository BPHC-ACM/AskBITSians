'use client';

import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './custom-select.module.css';

export default function CustomSelect({
  value,
  onValueChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
  label,
  icon: Icon,
  'aria-label': ariaLabel,
}) {
  return (
    <div className={`${styles.selectWrapper} ${className}`}>
      {label && (
        <label className={styles.label}>
          {Icon && <Icon size={16} />}
          {label}
        </label>
      )}
      <Select.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <Select.Trigger
          className={styles.selectTrigger}
          aria-label={ariaLabel || label}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={styles.selectContent}
            position='popper'
            sideOffset={5}
          >
            <Select.ScrollUpButton className={styles.scrollButton}>
              <ChevronUp size={16} />
            </Select.ScrollUpButton>
            <Select.Viewport className={styles.selectViewport}>
              <Select.Group>
                {options.map((option) => {
                  const optionValue =
                    typeof option === 'string' ? option : option.value;
                  const optionLabel =
                    typeof option === 'string' ? option : option.label;

                  return (
                    <Select.Item
                      key={optionValue}
                      value={optionValue}
                      className={styles.selectItem}
                    >
                      <Select.ItemText>{optionLabel}</Select.ItemText>
                      <Select.ItemIndicator className={styles.selectIndicator}>
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className={styles.scrollButton}>
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
