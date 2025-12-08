import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Verde principal
      600: '#16a34a', // Verde neon
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    neon: {
      green: '#00ff41',
      greenDark: '#16a34a',
      black: '#000000',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'white',
        bgGradient: 'linear(to-br, black, gray.900, black)',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'green' ? 'brand.600' : `${props.colorScheme}.600`,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'green' ? 'brand.700' : `${props.colorScheme}.700`,
            transform: 'translateY(-1px)',
            boxShadow: props.colorScheme === 'green' ? '0 0 10px rgba(22, 163, 74, 0.5)' : 'md',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        }),
        outline: (props) => ({
          borderColor: props.colorScheme === 'green' ? 'brand.600' : `${props.colorScheme}.600`,
          color: props.colorScheme === 'green' ? 'brand.400' : `${props.colorScheme}.400`,
          _hover: {
            bg: props.colorScheme === 'green' ? 'brand.900' : `${props.colorScheme}.900`,
            borderColor: props.colorScheme === 'green' ? 'brand.400' : `${props.colorScheme}.400`,
          },
        }),
      },
      defaultProps: {
        colorScheme: 'green',
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'white',
          color: 'gray.900',
          borderColor: 'brand.600',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'white',
            color: 'gray.900',
            _hover: {
              bg: 'gray.50',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Textarea: {
      baseStyle: {
        bg: 'white',
        color: 'gray.900',
        borderColor: 'brand.600',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          bg: 'blackAlpha.700',
        },
        dialog: {
          bgGradient: 'linear(to-br, gray.900, gray.800)',
          borderWidth: '2px',
          borderColor: 'brand.600',
          borderRadius: 'lg',
        },
        header: {
          color: 'brand.400',
        },
      },
    },
    Alert: {
      variants: {
        error: {
          container: {
            bg: 'red.900',
            borderColor: 'red.500',
            color: 'red.200',
          },
        },
      },
    },
  },
});

export default theme;

