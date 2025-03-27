import React, { useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';

interface ServiceRowProps {
  icon: React.ReactNode;
  title: string;
  services: any[];
  serviceType: string;
  viewAllLink?: string;
  viewAllText?: string;
  maxVisible?: number;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ 
  icon, 
  title, 
  services, 
  serviceType,
  viewAllLink = `/services/${serviceType}`,
  viewAllText,
  maxVisible = 8
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State to track if scroll arrows should be visible
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Calculate the scroll distance based on viewport size
  const scrollDistance = isMobile ? 300 : 500;
  
  // Handle scrolling
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' 
        ? container.scrollLeft - scrollDistance 
        : container.scrollLeft + scrollDistance;
      
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Check scroll position to show/hide arrows
  const handleScrollCheck = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      
      // Show left arrow if not at the start
      setShowLeftArrow(container.scrollLeft > 10);
      
      // Show right arrow if not at the end
      setShowRightArrow(
        container.scrollLeft < (container.scrollWidth - container.clientWidth - 10)
      );
    }
  };

  // Format viewAllText if not provided
  const finalViewAllText = viewAllText || `View All ${title.split(' ').pop() || ''}`;
  
  console.log(`ServiceRow rendering for ${serviceType} with ${services?.length || 0} services`);
  if (serviceType === 'venue') {
    console.log('Venue data:', services);
  }
  
  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* Header with title and view all button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h5" component="h2" fontWeight="600" sx={{ ml: 1 }}>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(viewAllLink)}
          size="small"
        >
          {finalViewAllText}
        </Button>
      </Box>
      
      {/* Scroll arrows */}
      {showLeftArrow && (
        <IconButton
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'background.default',
            }
          }}
          onClick={() => handleScroll('left')}
          size="large"
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      
      {showRightArrow && (
        <IconButton
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'background.default',
            }
          }}
          onClick={() => handleScroll('right')}
          size="large"
        >
          <ChevronRightIcon />
        </IconButton>
      )}
      
      {/* Scrollable container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          px: 1,
          py: 1,
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { // Chrome, Safari, Edge
            display: 'none'
          },
        }}
        onScroll={handleScrollCheck}
      >
        {services.map((service) => (
          <Box
            key={service.id}
            sx={{
              minWidth: { xs: '85%', sm: '45%', md: '30%' },
              pr: 2,
              '&:last-child': { pr: 0 }
            }}
          >
            <ServiceCard 
              service={service} 
              type={serviceType as any}
              onClick={() => navigate(`/service/${serviceType}/${service.id}`)} 
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ServiceRow; 