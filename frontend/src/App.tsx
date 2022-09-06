/* eslint react/prop-types: 0 */
/* eslint react/destructuring-assignment: 0 */
/* eslint react/no-unstable-nested-components: 0 */
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
  Popover,
  PopoverTrigger,
  Portal,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverFooter,
  PopoverContent,
  PopoverBody,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import React from "react";
import { useTable, Column, useSortBy } from "react-table";
import moment from "moment";
import axios from "./axios";
import { Coin } from "./types/Coin";
import { CreatePortfolio, Portfolio, UpdatePortfolio } from "./types/Portfolio";
import { User } from "./types/User";

const App = () => {
  const portfolioDefault = {
    coin: "bitcoin",
    quantity: 100,
    purchasePrice: 100,
  };

  const coinGeckoURL = "https://www.coingecko.com/en/coins";
  const portfolioRoute = "/api/portfolio";

  const [trending, setTrending] = React.useState<Coin[]>([]);
  const [supportedCoins, setSupportedCoins] = React.useState<Coin[]>([]);
  const [portfolio, setPortfolio] = React.useState<Portfolio[]>([]);
  const [createPortfolioValue, setCreatePortfolioValue] =
    React.useState<CreatePortfolio>(portfolioDefault);
  const [updatePortfolioValue, setUpdatePortfolioValue] =
    React.useState<CreatePortfolio>(portfolioDefault);

  const updatePortfolioState = (
    isCreate: boolean,
    coin?: string,
    quantity?: number,
    price?: number,
  ) => {
    const temp: CreatePortfolio | UpdatePortfolio = isCreate
      ? {
          ...createPortfolioValue,
        }
      : {
          ...updatePortfolioValue,
        };
    if (coin) {
      temp.coin = coin;
    } else if (quantity) {
      temp.quantity = quantity;
    } else if (price) {
      temp.purchasePrice = price;
    }
    if (isCreate) {
      setCreatePortfolioValue(temp);
    } else {
      setUpdatePortfolioValue(temp);
    }
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

  const deletePortfolio = (id: string) => {
    axios.webserver
      .delete(portfolioRoute, {
        data: { id },
      })
      .then(() => {
        let updatePortfolio = [...portfolio];
        updatePortfolio = updatePortfolio.filter((x) => x.id !== id);
        setPortfolio(updatePortfolio);
      });
  };

  React.useEffect(() => {
    axios.serverless.get("/api/trending-crypto").then((response) => {
      const { data } = response;
      const { coins }: { coins: Coin[] } = data;
      coins.sort((a, b) => a.market_cap_rank! - b.market_cap_rank!);
      setTrending(coins);
    });

    axios.webserver.get("/api/coin").then((response) => {
      const { data } = response;
      const coins: Coin[] = data;
      setSupportedCoins(coins);
    });

    axios.webserver.get("/api/portfolio").then((response) => {
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
        Header: "Purchase price",
        accessor: "purchasePrice",
        Cell: (props) => <Text>${(props.value / 100).toFixed(2)}</Text>,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Cost per coin",
        accessor: (row) => <Text>${(row.purchasePrice / 100 / row.quantity).toFixed(2)}</Text>,
        disableSortBy: true,
      },
      {
        Header: "Created Date",
        accessor: "createDate",
        Cell: (props) => <Text>{moment(props.value).utc().fromNow().toString()}</Text>,
      },
      {
        Header: "Last Update",
        accessor: "updateDate",
        Cell: (props) => <Text>{moment(props.value).fromNow().toString()}</Text>,
      },
      {
        Header: "Edit",
        accessor: (row) => (
          <Popover>
            <PopoverTrigger>
              <Button colorScheme="blue">Edit</Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>
                  <b>Edit record</b>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <FormControl w="85%" isRequired>
                    <FormLabel htmlFor="cryptocurrency">Cryptocurrency</FormLabel>
                    <Select
                      tagVariant="solid"
                      options={supportedCoins.map((coin) => ({
                        label: coin.name,
                        value: coin.id,
                      }))}
                    />
                  </FormControl>
                  <FormControl w="85%" pt="4" isRequired>
                    <FormLabel htmlFor="quantity">Quantity</FormLabel>
                    <NumberInput
                      defaultValue={row.quantity}
                      min={0.000001}
                      max={1000000}
                      keepWithinRange
                      clampValueOnBlur
                      precision={6}
                      step={5}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <FormHelperText>Support values between 0.000001 and 1000000.</FormHelperText>
                  </FormControl>
                  <FormControl w="85%" pt="4" isRequired>
                    <FormLabel htmlFor="price">Price</FormLabel>
                    <NumberInput
                      defaultValue={createPortfolioValue.purchasePrice}
                      min={0.01}
                      max={1000000}
                      keepWithinRange
                      clampValueOnBlur
                      precision={2}
                      step={5}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <FormHelperText>
                      Purchase price must be between $0.01 and $1,000,000.
                    </FormHelperText>
                  </FormControl>
                </PopoverBody>
                <PopoverFooter>
                  <Button colorScheme="blue">Save</Button>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>
        ),
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
    { columns, data },
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
      <Container maxW="1920px" p="20px">
        <Box>
          <Box>
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
          >
            <Table overflow="scroll" {...getTableProps()}>
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
        </Box>
        <SimpleGrid columns={2} spacing={10}>
          <Box height="80px">
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
                        updatePortfolioState(true, e?.value);
                      }}
                    />
                  </FormControl>
                  <FormControl w="85%" pt="4" isRequired>
                    <FormLabel htmlFor="quantity">Quantity</FormLabel>
                    <InputGroup>
                      <NumberInput
                        onChange={(e) => updatePortfolioState(true, undefined, parseFloat(e))}
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
                        onChange={(e) =>
                          updatePortfolioState(true, undefined, undefined, parseFloat(e))
                        }
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

                  <Text>Your average buy price is </Text>
                  <Button mt={4} colorScheme="teal" type="submit" onClick={() => createPortfolio()}>
                    Submit
                  </Button>
                </Box>
              </Box>
            </Flex>
          </Box>
          <Box height="80px">
            <Flex alignItems="end" alignContent="flex-end" flexDirection="row" p="2">
              <Box paddingRight="4px">
                <Heading as="h1" size="md">
                  Trending Coins
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
        </SimpleGrid>
      </Container>
    </ChakraProvider>
  );
};

export default App;
