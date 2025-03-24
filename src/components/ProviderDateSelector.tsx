import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  IconButton,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import {
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Check as CheckIcon,
  DateRange as DateRangeIcon,
  Today as TodayIcon,
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format, isWithinInterval, startOfMonth, addMonths, isSameMonth, isSameYear, isSameDay } from 'date-fns';

type ServiceType = 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 
  'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security';

// Define a proper type for the provider
interface Provider {
  id: string;
  name: string;
  availability: string[];
  [key: string]: any; // For any additional properties
}

interface ProviderDateSelectorProps {
  provider: Provider;
  providerType: ServiceType;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  selectedDate: Date | null;
  selectedDates: Date[];
  onDateSelect: (date: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isMultiSelect: boolean;
  onSelectionModeChange?: (isMultiSelect: boolean) => void;
  // Props for enhanced filtering
  unavailableDates?: string[]; // Dates that are filtered out due to prior selections
  alreadySelectedProviderDates?: string[]; // Dates already selected for other providers
  availableDatesForDisplay?: Date[]; // Optional prop for explicitly controlling which dates to display
  selectedDatesForOtherServices?: Date[]; // Added for the new conflict logic
}

const ProviderDateSelector: React.FC<ProviderDateSelectorProps> = ({
  provider,
  providerType,
  dateRange,
  selectedDate,
  selectedDates,
  onDateSelect,
  onConfirm,
  onCancel,
  isMultiSelect,
  onSelectionModeChange,
  unavailableDates = [],
  alreadySelectedProviderDates = [],
  availableDatesForDisplay = [],
  selectedDatesForOtherServices = [],
}) => {
  const theme = useTheme();
  
  // Local state to control whether multiple dates can be selected for this provider
  const [allowMultipleSelection, setAllowMultipleSelection] = useState(isMultiSelect);
  
  // Local state for internal selection management - ensures UI updates instantly
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate);
  const [internalSelectedDates, setInternalSelectedDates] = useState<Date[]>(selectedDates);

  // Add state for current month view
  const [currentMonth, setCurrentMonth] = useState(() => {
    // If we have a selected date, start with that month
    if (selectedDate) return startOfMonth(selectedDate);
    // If we have a date range, start with the first month
    if (dateRange.start) return startOfMonth(dateRange.start);
    // Default to current month
    return startOfMonth(new Date());
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Short delay for better UX
    
    return () => clearTimeout(timer);
  }, []);

  // Update internal state when props change
  useEffect(() => {
    // When the selected dates from props change, update internal state
    setInternalSelectedDate(selectedDate);
    setInternalSelectedDates(selectedDates);
    
    // When isMultiSelect changes, update our local state
    setAllowMultipleSelection(isMultiSelect);
  }, [selectedDate, selectedDates, isMultiSelect]);

  // Memoize date calculations to avoid recalculating on every render
  const availableDatesInRange = useMemo(() => {
    if (!provider) return [];

    // If custom available dates are provided, use those directly - these are already pre-filtered
    if (availableDatesForDisplay && availableDatesForDisplay.length > 0) {
      // These dates are already filtered for availability, just ensure they're not otherwise unavailable
      return availableDatesForDisplay.filter(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return !unavailableDates.includes(dateStr);
      });
    }
    
    // Otherwise filter based on date range or selected dates
    return provider.availability
      .map((dateString: string) => new Date(dateString))
      .filter((date: Date) => {
        // If we're using date range
        if (dateRange.start && dateRange.end) {
          return isWithinInterval(date, { start: dateRange.start, end: dateRange.end });
        }
        // If we're in multi-select mode with individual dates
        else if (isMultiSelect && selectedDates && selectedDates.length > 0) {
          // Check if this date is among the selected dates
          return selectedDates.some(selectedDate => 
            format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
        }
        return false;
      });
  }, [provider, dateRange, isMultiSelect, selectedDates, unavailableDates, availableDatesForDisplay]);

  // Create an array of all dates in the range, for showing unavailable dates too
  const allDatesInRange = useMemo(() => {
    console.log('Calculating allDatesInRange');
    console.log('dateRange:', dateRange);
    console.log('isMultiSelect:', isMultiSelect);
    console.log('selectedDates:', selectedDates?.length);
    
    const dates: Date[] = [];
    
    // Always include all dates in the range regardless of availability
    if (dateRange.start && dateRange.end) {
      // In date range mode, include all dates in the range
      let currentDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      console.log('Date Range Mode, adding dates from:', 
        format(currentDate, 'yyyy-MM-dd'), 'to', format(endDate, 'yyyy-MM-dd'));
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (isMultiSelect && selectedDates && selectedDates.length > 0) {
      // In multi-select mode, include all selected dates
      console.log('Multi-select Mode, adding selected dates');
      selectedDates.forEach(date => {
        dates.push(new Date(date));
      });
    } else if (availableDatesForDisplay && availableDatesForDisplay.length > 0) {
      // If none of the above, use availableDatesForDisplay as fallback
      console.log('Using availableDatesForDisplay as fallback');
      return [...availableDatesForDisplay];
    }
    
    // Make sure we're returning at least some dates
    console.log(`allDatesInRange returning ${dates.length} dates:`, 
      dates.map(d => format(d, 'yyyy-MM-dd')));
    return dates;
  }, [dateRange, isMultiSelect, selectedDates, availableDatesForDisplay]);

  // Memoize these functions for better performance
  const isDateSelected = useCallback((date: Date) => {
    if (!date) return false;

    if (allowMultipleSelection) {
      return internalSelectedDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    } else {
      return internalSelectedDate && format(internalSelectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }
  }, [allowMultipleSelection, internalSelectedDate, internalSelectedDates]);

  const isDateAvailable = useCallback((date: Date) => {
    if (!date) return false;
    const dateStr = format(date, 'yyyy-MM-dd');

    // If we have pre-filtered dates from the parent component, use those as the source of truth
    if (availableDatesForDisplay && availableDatesForDisplay.length > 0) {
      // Check if this date is in our pre-filtered list
      return availableDatesForDisplay.some(availableDate => 
        format(availableDate, 'yyyy-MM-dd') === dateStr
      );
    }

    // Otherwise fall back to checking provider's availability directly
    if (!provider || !provider.availability) return false;
    
    // A date is available if it's in the provider's availability array AND not in unavailable dates
    return provider.availability.includes(dateStr) && !unavailableDates.includes(dateStr);
  }, [provider, unavailableDates, availableDatesForDisplay]);

  const isDateSelectedForOtherProvider = useCallback((date: Date) => {
    if (!date) return false;

    const dateStr = format(date, 'yyyy-MM-dd');
    return alreadySelectedProviderDates.includes(dateStr);
  }, [alreadySelectedProviderDates]);

  // Filtered dates based on current month view
  const datesInCurrentMonth = useMemo(() => {
    return allDatesInRange.filter(date => isSameMonth(date, currentMonth));
  }, [allDatesInRange, currentMonth]);

  // Boolean for determining if any dates can be selected
  const hasAvailableDates = useMemo(() => {
    const result = availableDatesInRange.length > 0;
    console.log(`Provider ${provider?.name}: Has available dates = ${result}`, 
      availableDatesInRange.map(d => format(d, 'yyyy-MM-dd')));
    return result;
  }, [availableDatesInRange, provider?.name]);
  
  // Boolean for checking if date selection is valid
  const isSelectionValid = (!allowMultipleSelection && internalSelectedDate) || 
                          (allowMultipleSelection && internalSelectedDates.length > 0);

  // Handle date click - with internal state update for immediate visual feedback
  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Always call parent component's handler first
    onDateSelect(date);
    
    // Local state updates for immediate visual feedback
    if (allowMultipleSelection) {
      const exists = internalSelectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
      
      if (exists) {
        // Remove from selection
        const updatedDates = internalSelectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateStr);
        setInternalSelectedDates(updatedDates);
        if (updatedDates.length === 0) {
          setInternalSelectedDate(null);
        }
      } else {
        // Add to selection
        const updatedDates = [...internalSelectedDates, date];
        setInternalSelectedDates(updatedDates);
        setInternalSelectedDate(date);
      }
    } else {
      // Single date selection - just replace
      setInternalSelectedDate(date);
      setInternalSelectedDates([date]);
    }
  };

  // Handle month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(current => 
      direction === 'next' ? addMonths(current, 1) : addMonths(current, -1)
    );
  };

  // Add keyboard handling for date selection
  const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
    // Spacebar or Enter to select
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleDateClick(date);
    }
  };

  // Add bulk selection feature
  const handleSelectAllInMonth = () => {
    if (!allowMultipleSelection) return;
    
    // Filter available dates in current month
    const availableDatesInMonth = datesInCurrentMonth.filter(date => 
      isDateAvailable(date) && !isDateSelected(date)
    );
    
    // Skip if no available dates
    if (availableDatesInMonth.length === 0) return;
    
    // Create a copy of the currently selected dates
    const newSelectedDates = [...internalSelectedDates];
    
    // Add each available date if not already selected
    availableDatesInMonth.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const exists = internalSelectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
      
      if (!exists) {
        newSelectedDates.push(date);
        // Also call parent handler for each date
        onDateSelect(date);
      }
    });
    
    // Update internal state
    setInternalSelectedDates(newSelectedDates);
    // Set the last selected date as the current single date
    if (newSelectedDates.length > 0) {
      setInternalSelectedDate(newSelectedDates[newSelectedDates.length - 1]);
    }
  };
  
  // Add bulk deselection feature
  const handleDeselectAllInMonth = () => {
    if (!allowMultipleSelection) return;
    
    // Filter selected dates in current month
    const selectedDatesInMonth = datesInCurrentMonth.filter(date => 
      isDateSelected(date)
    );
    
    // Skip if no selected dates
    if (selectedDatesInMonth.length === 0) return;
    
    // Create a new array with dates that are not in the current month
    const newSelectedDates = internalSelectedDates.filter(selectedDate => 
      !selectedDatesInMonth.some(monthDate => 
        format(selectedDate, 'yyyy-MM-dd') === format(monthDate, 'yyyy-MM-dd')
      )
    );
    
    // Call parent handler for each deselected date
    selectedDatesInMonth.forEach(date => {
      onDateSelect(date); // In handleDateClick, this will toggle off the date
    });
    
    // Update internal state
    setInternalSelectedDates(newSelectedDates);
    
    // Update the current single date selection
    if (newSelectedDates.length > 0) {
      setInternalSelectedDate(newSelectedDates[0]);
    } else {
      setInternalSelectedDate(null);
    }
  };

  // Memoize the date grid to avoid recreation on every render
  const dateGrid = useMemo(() => {
    // Show loading skeleton when loading
    if (isLoading) {
      return (
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={120} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Grid container spacing={2}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    // Log information about the dates we're working with
    console.log('Available dates in range:', availableDatesInRange.length);
    console.log('All dates in range:', allDatesInRange.length);
    console.log('Dates in current month:', datesInCurrentMonth.length);

    // Show warning if no available dates, but continue to render all dates
    if (!hasAvailableDates) {
      console.log('No available dates for provider:', provider?.name);
      console.log('Date range:', dateRange);
      console.log('Selected dates:', selectedDates);
      
      // Add a warning message, but continue to show all dates with red unavailable indicators
      setTimeout(() => {
        console.warn('No available dates in selected range for this provider!');
      }, 0);
    }

    // Get month name for the current month
    const currentMonthName = format(currentMonth, 'MMMM yyyy');

    // Generate dates for the current month from the date range
    let datesInCurrentMonthFiltered: Date[] = [];
    
    if (allDatesInRange.length > 0) {
      // If we have dates in range, filter to current month
      datesInCurrentMonthFiltered = allDatesInRange.filter(date => 
        isSameMonth(date, currentMonth) && isSameYear(date, currentMonth)
      );
    } else if (dateRange.start && dateRange.end) {
      // If we have a date range but no allDatesInRange, generate dates for current month in range
      const start = new Date(Math.max(
        dateRange.start.getTime(),
        startOfMonth(currentMonth).getTime()
      ));
      
      const end = new Date(Math.min(
        dateRange.end.getTime(),
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getTime()
      ));
      
      if (start <= end) {
        const dates: Date[] = [];
        let currentDate = new Date(start);
        
        while (currentDate <= end) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        datesInCurrentMonthFiltered = dates;
      }
    }

    console.log('Dates in current month after filtering:', 
      datesInCurrentMonthFiltered.map(d => format(d, 'yyyy-MM-dd')));

    return (
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={() => navigateMonth('prev')}
            aria-label="Previous Month"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">{currentMonthName}</Typography>
          <IconButton 
            onClick={() => navigateMonth('next')}
            aria-label="Next Month"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        
        {!hasAvailableDates && (
          <Typography color="error" sx={{ mb: 2 }}>
            {isMultiSelect && selectedDates.length > 0 ? 
              "This provider is not available on any of your selected dates." :
              "No available dates in the selected range for this provider."}
          </Typography>
        )}

        {datesInCurrentMonthFiltered.length > 0 ? (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {datesInCurrentMonthFiltered.map((date: Date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isAvailable = isDateAvailable(date);
              const isSelected = isDateSelected(date);
              const isConflictWithOtherService = selectedDatesForOtherServices && 
                selectedDatesForOtherServices.some(d => isSameDay(d, date));

              return (
                <Grid item xs={6} sm={4} md={3} key={dateStr}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      opacity: isAvailable ? 1 : 0.8,
                      position: 'relative',
                      borderLeft: isConflictWithOtherService ? '5px solid purple' : 'none',
                      backgroundColor: !isAvailable && isConflictWithOtherService ? 
                        'rgba(255, 200, 200, 0.2)' : 'inherit'
                    }}
                    onClick={isAvailable ? () => handleDateClick(date) : undefined}
                  >
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start' 
                      }}>
                        <Typography variant="h6">
                          {format(date, 'd')}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={isAvailable ? "Available" : "Unavailable"}
                          color={isAvailable ? "success" : "error"}
                          sx={{ height: 24 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(date, 'EEEE')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {format(date, 'MMM yyyy')}
                      </Typography>
                      
                      {isSelected && (
                        <Box sx={{ 
                          position: 'absolute',
                          bottom: 8,
                          right: 8
                        }}>
                          <Chip 
                            size="small"
                            label="Selected" 
                            color="primary"
                            sx={{ height: 24 }}
                          />
                        </Box>
                      )}

                      {isConflictWithOtherService && (
                        <Tooltip title="This date is selected for another service">
                          <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
                            <InfoIcon color="secondary" fontSize="small" />
                          </Box>
                        </Tooltip>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography align="center" color="textSecondary">
            No dates available in this month. Try another month.
          </Typography>
        )}
      </Box>
    );
  }, [
    isLoading,
    hasAvailableDates,
    isMultiSelect,
    selectedDates,
    datesInCurrentMonth,
    currentMonth, 
    handleDateClick,
    handleKeyDown,
    isDateAvailable, 
    isDateSelected, 
    isDateSelectedForOtherProvider,
    allowMultipleSelection,
    theme.palette.primary.main,
    handleSelectAllInMonth,
    handleDeselectAllInMonth,
    navigateMonth,
    provider?.name,
    provider?.availability,
    dateRange,
    availableDatesInRange.length,
    selectedDatesForOtherServices
  ]);

  // Early return if no provider - MOVED this to after all hook declarations
  if (!provider) {
    return null;
  }

  // Handle selection mode change
  const handleSelectionModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelectionMode: string | null,
  ) => {
    if (newSelectionMode === null) return;
    
    const newMultiSelectMode = newSelectionMode === 'multiple';
    
    setAllowMultipleSelection(newMultiSelectMode);
    
    // Call the onSelectionModeChange prop if it exists
    if (onSelectionModeChange) {
      onSelectionModeChange(newMultiSelectMode);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            startIcon={<ArrowBackIcon />}
          >
            Back to Services
          </Button>
          
          {onSelectionModeChange && (
            <ToggleButtonGroup
              value={allowMultipleSelection ? 'multiple' : 'single'}
              exclusive
              onChange={handleSelectionModeChange}
              aria-label="date selection mode"
              size="small"
            >
              <ToggleButton value="single" aria-label="single date">
                <TodayIcon sx={{ mr: 1 }} />
                Single Date
              </ToggleButton>
              <ToggleButton value="multiple" aria-label="multiple dates">
                <DateRangeIcon sx={{ mr: 1 }} />
                Multiple Dates
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
        
        <Typography variant="h6">
          Select Date{allowMultipleSelection ? 's' : ''} for {provider.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Please select the specific date{allowMultipleSelection ? 's' : ''} you want to book this {providerType}.
          {alreadySelectedProviderDates.length > 0 && (
            <span> Dates with a purple border are already booked for other services. Red dates are unavailable for this provider.</span>
          )}
        </Typography>
        
        {dateGrid || (
          <Box sx={{ 
            my: 2, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: 300
          }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>

      {/* Navigation buttons at the bottom */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mt: 3,
        mb: 3
      }}>
        <Button 
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={!isSelectionValid}
        >
          Confirm Selection
        </Button>
      </Box>
    </Box>
  );
};

export default ProviderDateSelector; 