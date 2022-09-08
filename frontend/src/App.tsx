/* eslint react/prop-types: 0 */
/* eslint react/destructuring-assignment: 0 */
/* eslint react/no-unstable-nested-components: 0 */
// Styles
import {
  ChakraProvider,
  Divider,
  Box,
  Flex,
  Text,
  Container,
  Image,
  Heading,
  Stack,
  Link,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  FormHelperText,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
// React
import { useTable, Column, useSortBy } from "react-table";
import React from "react";
import moment from "moment";
import axios from "./axios";
// Compoenent
import EditSection from "./components/EditSection";
// Types
import { Coin } from "./types/Coin";
import { User } from "./types/User";
import { CreatePortfolio, Portfolio, UpdatedPortfolio, UpdatePortfolio } from "./types/Portfolio";

const App = () => {
  const portfolioDefault = {
    coin: "bitcoin",
    quantity: 100,
    purchasePrice: 100,
  };

  const coinGeckoURL = "https://www.coingecko.com/en/coins";
  const portfolioRoute = "/api/portfolio";
  const coinRoute = "/api/coin";
  const serverRoute = "/api/trending-crypto";

  const [trending, setTrending] = React.useState<Coin[]>([]);
  const [supportedCoins, setSupportedCoins] = React.useState<Coin[]>([]);
  const [portfolio, setPortfolio] = React.useState<Portfolio[]>([]);
  const [createPortfolioValue, setCreatePortfolioValue] =
    React.useState<CreatePortfolio>(portfolioDefault);

  const updatePortfolioState = (coin?: string, quantity?: number, price?: number) => {
    const temp: CreatePortfolio = {
      ...createPortfolioValue,
    };
    if (coin) {
      temp.coin = coin;
    } else if (quantity) {
      temp.quantity = quantity;
    } else if (price) {
      temp.purchasePrice = price;
    }
    setCreatePortfolioValue(temp);
  };

  const createPortfolio = () => {
    axios.webserver
      .post(portfolioRoute, {
        ...createPortfolioValue,
        purchasePrice: createPortfolioValue.purchasePrice * 100,
      })
      .then((response) => {
        const updatePortfolio = [...portfolio];
        const { data } = response;
        const newPortfolio: Portfolio = {
          ...data,
          coin: supportedCoins.find((x) => x.id === data.coinId),
        };
        updatePortfolio.push(newPortfolio);
        setPortfolio(updatePortfolio);
      });
  };

  const updatePortfolio = (updateData: UpdatePortfolio) => {
    axios.webserver
      .put(portfolioRoute, {
        ...updateData,
        purchasePrice: updateData.purchasePrice * 100,
      })
      .then((response) => {
        let temp = [...portfolio];
        const { data } = response;
        const { raw } = data;
        const updatedCoin: UpdatedPortfolio[] = raw;
        const updatedPortfolio: Portfolio = {
          ...updatedCoin[0],
          coin: supportedCoins.find((x) => x.id === updatedCoin[0].coinId)!,
        };
        temp = temp.filter((x) => x.id !== updatedPortfolio.id);
        temp.push(updatedPortfolio);
        setPortfolio(temp);
      });
  };

  const deletePortfolio = (id: string) => {
    axios.webserver
      .delete(portfolioRoute, {
        data: { id },
      })
      .then(() => {
        let temp = [...portfolio];
        temp = temp.filter((x) => x.id !== id);
        setPortfolio(temp);
      });
  };

  React.useEffect(() => {
    axios.serverless.get(serverRoute).then((response) => {
      const { data } = response;
      const { coins }: { coins: Coin[] } = data;
      coins.sort((a, b) => a.market_cap_rank! - b.market_cap_rank!);
      setTrending(coins);
    });

    axios.webserver.get(coinRoute).then((response) => {
      const { data } = response;
      const coins: Coin[] = data;
      setSupportedCoins(coins);
    });

    axios.webserver.get(portfolioRoute).then((response) => {
      const { data } = response;
      const user: User = data;
      setPortfolio(user.portfolios);
    });
  }, []);

  const columns: Column<Portfolio>[] = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "coin",
        Cell: (props) => (
          <Text>
            <b>{props.value.name}</b> {props.value.symbol}
          </Text>
        ),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Purchase price",
        accessor: "purchasePrice",
        Cell: (props) => <Text>${(props.value / 100).toFixed(2)}</Text>,
      },
      {
        Header: "Cost per coin",
        accessor: (row) => <Text>${(row.purchasePrice / 100 / row.quantity).toFixed(2)}</Text>,
        disableSortBy: true,
      },
      {
        Header: "Created Date",
        accessor: "createDate",
        Cell: (props) => <Text>{moment(props.value).add(8, "hours").fromNow()}</Text>,
      },
      {
        Header: "Last Update",
        accessor: "updateDate",
        Cell: (props) => (
          <Text>{moment(props.value).add(8, "hours").fromNow().toString()}</Text>
        ),
      },
      {
        Header: "Edit",
        accessor: (row) => (
          <EditSection
            updatePortfolio={{
              id: row.id,
              purchasePrice: row.purchasePrice / 100,
              quantity: row.quantity,
              coin: row.coin.id,
            }}
            coinName={row.coin.name}
            updateFunction={updatePortfolio}
            supportedCoins={supportedCoins}
          />
        ),
        disableSortBy: true,
      },
      {
        Header: "",
        accessor: "id",
        disableSortBy: true,
        Cell: (props) => (
          <Button
            _hover={{
              bg: "red",
              color: "white",
            }}
            colorScheme="orange"
            onClick={() => deletePortfolio(props.value)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [portfolio],
  );

  const data = React.useMemo(() => portfolio, [portfolio]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "updateDate",
            desc: false,
          },
        ],
      },
    },

    useSortBy,
  );

  return (
    <ChakraProvider>
      <Box bg="RGBA(0, 0, 0, 0.80)" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>
            <Text fontWeight="semibold" color="white">
              CS3219 Task C - Crypto Portfolio Tracker
            </Text>
          </Box>
        </Flex>
      </Box>
      <Container maxW="1920px" p="20px 100px">
        <Flex
          flexDir="row"
          alignItems="flex-start"
          alignContent="flex-start"
          justifyContent="center"
        >
          <Flex p="2" flexDir="column">
            <Box>
              <Box>
                <Box>
                  <Heading as="h1" size="md">
                    Add purchase
                  </Heading>
                </Box>
                <Box>
                  <Text>POST | api/portfolio/</Text>
                </Box>
              </Box>
              <Box
                border="1px"
                borderRadius="8px"
                borderColor="blackAlpha.500"
                p="4"
                margin="8px 8px 8px 0"
              >
                <FormControl w="85%" isRequired>
                  <FormLabel htmlFor="cryptocurrency">Cryptocurrency</FormLabel>

                  <Select
                    tagVariant="solid"
                    defaultValue={{ label: "Bitcoin", value: createPortfolioValue.coin }}
                    options={supportedCoins.map((coin) => ({
                      label: coin.name,
                      value: coin.id,
                    }))}
                    onChange={(e) => {
                      updatePortfolioState(e?.value);
                    }}
                  />
                </FormControl>
                <FormControl w="85%" pt="4" isRequired>
                  <FormLabel htmlFor="quantity">Quantity</FormLabel>
                  <InputGroup>
                    <NumberInput
                      onChange={(e) => updatePortfolioState(undefined, parseFloat(e))}
                      defaultValue={createPortfolioValue.quantity}
                      min={0.000001}
                      max={1000000}
                      keepWithinRange
                      clampValueOnBlur
                      precision={6}
                      step={5}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </InputGroup>
                  <FormHelperText>Support values between 0.000001 and 1000000.</FormHelperText>
                </FormControl>
                <FormControl w="85%" pt="4" isRequired>
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>$</InputLeftAddon>
                    <NumberInput
                      onChange={(e) => updatePortfolioState(undefined, undefined, parseFloat(e))}
                      defaultValue={createPortfolioValue.purchasePrice}
                      min={0.01}
                      max={1000000}
                      keepWithinRange
                      clampValueOnBlur
                      precision={2}
                      step={5}
                    >
                      <NumberInputField borderLeftRadius="0px" />
                    </NumberInput>
                  </InputGroup>

                  <FormHelperText>
                    Purchase price must be between $0.01 and $1,000,000.
                  </FormHelperText>
                </FormControl>

                <Text pt="2">
                  Your average buy price is{" "}
                  <b>
                    {`$${(
                      createPortfolioValue.purchasePrice / createPortfolioValue.quantity
                    ).toFixed(2)}`}
                    .
                  </b>
                </Text>
                <Button mt={4} colorScheme="teal" type="submit" onClick={() => createPortfolio()}>
                  Submit
                </Button>
              </Box>
            </Box>
          </Flex>

          <Flex flexDirection="column" p="2">
            <Box paddingRight="4px">
              <Heading as="h1" size="md">
                Trending Coins
              </Heading>
            </Box>
            <Box>
              <Text>retrieved by Azure Function</Text>
            </Box>
            <Box>
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
                      <Flex
                        w={8}
                        h={8}
                        align="center"
                        justify="center"
                        rounded="full"
                        mb={1}
                        mr={1}
                      >
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
                            <b>Ranking:</b> {coin.market_cap_rank}
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
          </Flex>
        </Flex>
        <Flex flexDir="column" alignItems="center">
          <Box alignSelf="flex-start">
            <Box>
              <Heading as="h1" size="md">
                Get all purchase
              </Heading>
            </Box>
            <Box>
              <Text>GET, PUT, DELETE | api/portfolio/</Text>
            </Box>
          </Box>
          <Box
            border="1px"
            borderRadius="8px"
            borderColor="blackAlpha.500"
            p="4"
            margin="8px 8px 8px 0"
            width="100%"
          >
            <Table overflow="auto" {...getTableProps()}>
              <Thead>
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          // <Th {...column.getHeaderProps()}>.

                          <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render("Header")}
                            <chakra.span pl="4">
                              {column.isSorted && column.isSortedDesc ? (
                                <TriangleDownIcon aria-label="sorted descending" />
                              ) : (
                                ""
                              )}
                            </chakra.span>
                            <chakra.span pl="4">
                              {column.isSorted && column.isSortedDesc === false ? (
                                <TriangleUpIcon aria-label="sorted ascending" />
                              ) : (
                                ""
                              )}
                            </chakra.span>
                          </Th>
                        ))
                      }
                    </Tr>
                  ))
                }
              </Thead>
              {/* Apply the table body props */}
              <Tbody {...getTableBodyProps()}>
                {
                  // Loop over the table rows
                  rows.map((row) => {
                    // Prepare the row for display
                    prepareRow(row);
                    return (
                      // Apply the row props
                      <Tr {...row.getRowProps()}>
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => (
                            // Apply the cell props
                            <Td {...cell.getCellProps()}>
                              {
                                // Render the cell contents
                                cell.render("Cell")
                              }
                            </Td>
                          ))
                        }
                      </Tr>
                    );
                  })
                }
              </Tbody>
            </Table>
          </Box>
        </Flex>
        <Divider mt="20px" mb="20px" />
      <Text>By: Goh Zheng Teck | AY22/23 CS3219 OTOT Task B</Text>
      </Container>
     
    </ChakraProvider>
  );
};

export default App;
