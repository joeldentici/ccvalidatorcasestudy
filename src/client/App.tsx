import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "./utils/trpc";
import { httpBatchLink } from "@trpc/client";
import {
  Box,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { debounce } from "lodash";

function useDebouncedValue<T>(value: T, time: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetDebouncedValue = useMemo(
    () => debounce(setDebouncedValue, time),
    [setDebouncedValue, time]
  );

  useEffect(() => {
    debouncedSetDebouncedValue(value);
  }, [debouncedSetDebouncedValue, value]);

  return debouncedValue;
}

function CreditCardValidatorApp() {
  const [cardNumber, setCardNumber] = useState("");

  const debouncedCardNumber = useDebouncedValue(cardNumber, 300);

  const { data, isFetching } = trpc.isValidCardNumber.useQuery(
    debouncedCardNumber,
    {
      enabled: !!debouncedCardNumber,
    }
  );

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Credit Card Validator
      </Typography>
      <Box sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Credit Card Number"
          autoFocus
          error={
            cardNumber !== "" &&
            cardNumber === debouncedCardNumber &&
            !isFetching &&
            data === false
          }
          helperText={(() => {
            if (cardNumber === "") {
              return undefined;
            }

            if (
              data === undefined ||
              isFetching ||
              cardNumber !== debouncedCardNumber
            ) {
              return "Validating credit card number...";
            }

            if (!data) {
              return "Invalid credit card number entered";
            }

            return "Valid credit card number entered.";
          })()}
          value={cardNumber}
          onChange={(ev) => setCardNumber(ev.target.value)}
        />
      </Box>
    </Box>
  );
}

const defaultTheme = createTheme();

declare global {
  interface Window {
    config:
      | {
          apiEndpoint: string;
        }
      | undefined;
  }
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: window.config?.apiEndpoint ?? "http://localhost:3000",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <CreditCardValidatorApp />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
