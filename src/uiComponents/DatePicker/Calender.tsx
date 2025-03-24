import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import 'react-day-picker/dist/style.css';
import styles from './calendar.module.css';

interface DatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: string;
  children?: React.ReactNode;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, minDate, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className={styles.datePickerContainer}>
      <div className={styles.dateDisplay} onClick={() => setIsOpen(!isOpen)}>
        {selectedDate ? formatDisplayDate(selectedDate) : children}
      </div>

      {isOpen && (
        <div className={styles.calendar}>
          <DayPicker
            mode="single"
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={handleDaySelect}
            fromDate={minDate ? new Date(minDate) : undefined}
            captionLayout="dropdown"
            className={styles.root}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
