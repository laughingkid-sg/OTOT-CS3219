import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Container,
  SimpleGrid,
  Image,
  Heading,
  Stack,
  Link,
} from "@chakra-ui/react";
import React from "react";
import axios from "./axios";
import { Coin } from "./types/Coin";

const App = () => {
  const [trending, setTrending] = React.useState<Coin[]>([]);
  const coinGeckoURL = "https://www.coingecko.com/en/coins";
  React.useEffect(() => {
    axios.serverless.get("/api/trending-crypto").then((response) => {
      const { data } = response;
      const { coins } : { coins : Coin[]} = data;
      coins.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
      setTrending(coins);
    });
  }, []);

  if (!trending) return null;

  return (
    <ChakraProvider>
      <Box bg="RGBA(0, 0, 0, 0.80)" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>
            <Text fontWeight="semibold" color="white">
              CS3219 Task C
            </Text>
          </Box>
        </Flex>
      </Box>
      <Container maxW="1080px" p="20px">
        <SimpleGrid columns={2} spacing={10}>
          <Box bg="tomato" height="80px" />
          <Box height="80px">
            <Flex alignItems="end" alignContent="flex-end" flexDirection="row" p="2">
              <Box paddingRight="4px">
                <Heading as="h1" size="md">
                  Trending Coin
                </Heading>
              </Box>
              <Box>
                <Text>retrieved by Azure Function</Text>
              </Box>
            </Flex>
            {trending.map((coin) => (
              <Box
                key={coin.coin_id}
                border="1px"
                borderRadius="8px"
                borderColor="blackAlpha.500"
                p="4"
                m="4"
              >
                <Box display="flex" alignItems="baseline">
                  <Stack direction="row" align="center">
                    <Flex w={8} h={8} align="center" justify="center" rounded="full" mb={1} mr={1}>
                      <Link
                        fontWeight="bold"
                        href={`${coinGeckoURL}/${coin.coin_id}`}
                        target="_blank"
                      >
                        <Image src={coin.large} alt={coin.name} />
                      </Link>
                    </Flex>

                    <Flex flexDirection="column">
                      <Box>
                        <Link
                          fontWeight="bold"
                          href={`${coinGeckoURL}/${coin.coin_id}`}
                          target="_blank"
                        >
                          {coin.name} ({coin.symbol})
                        </Link>
                      </Box>
                      <Box>
                        <Text>
                          <b>CoinGecko Ranking:</b> {coin.market_cap_rank}
                        </Text>
                      </Box>
                      <Box>
                        <Text>
                          <b>Price in BTC:</b> {coin.price_btc}
                        </Text>
                      </Box>
                    </Flex>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </SimpleGrid>
      </Container>
    </ChakraProvider>
  );
};

export default App;
