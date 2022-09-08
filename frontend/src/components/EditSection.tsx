import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverFooter,
  PopoverContent,
  Button,
  PopoverBody,
  FormControl,
  NumberInputField,
  FormHelperText,
  InputLeftAddon,
  InputGroup,
  NumberInput,
  FormLabel,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React from "react";
import { Coin } from "../types/Coin";
import { UpdatePortfolio } from "../types/Portfolio";

const editSection = (props: {
  updatePortfolio: UpdatePortfolio;
  supportedCoins: Coin[];
  coinName: string;
  updateFunction: (updatePortfolioValue : UpdatePortfolio) => void
}) => {
    const { updatePortfolio, supportedCoins, coinName, updateFunction} = props

    const [updatePortfolioValue, setUpdatePortfolioValue] =
      React.useState<UpdatePortfolio>(updatePortfolio);

      const updatePortfolioState = (
        coin?: string,
        quantity?: number,
        price?: number,
      ) => {
        const temp: UpdatePortfolio = {
              ...updatePortfolioValue,
            }
        if (coin) {
          temp.coin = coin;
        } else if (quantity) {
          temp.quantity = quantity;
        } else if (price) {
          temp.purchasePrice = price;
        }
        setUpdatePortfolioValue(temp);
      };
    

  return (
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
                defaultValue={{ label: coinName, value: updatePortfolio.coin }}
                onChange={(e) => 
                  updatePortfolioState(e?.value)
                }
              />
            </FormControl>
            <FormControl w="85%" pt="4" isRequired>
              <FormLabel htmlFor="quantity">Quantity</FormLabel>
              <NumberInput
                onChange={(e) => updatePortfolioState(undefined, parseFloat(e))}
                defaultValue={updatePortfolio.quantity}
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
              <InputGroup>
                <InputLeftAddon>$</InputLeftAddon>
                <NumberInput
                  onChange={(e) =>  updatePortfolioState(undefined, undefined, parseFloat(e))}
                  defaultValue={updatePortfolio.purchasePrice / 100}
                  min={0.01}
                  max={1000000}
                  keepWithinRange
                  clampValueOnBlur
                  precision={2}
                  step={5}
                >
                  <NumberInputField />
                </NumberInput>
              </InputGroup>
              <FormHelperText>Purchase price must be between $0.01 and $1,000,000.</FormHelperText>
            </FormControl>
          </PopoverBody>
          <PopoverFooter>
            <Button colorScheme="blue" onClick={() => updateFunction(updatePortfolioValue)}>Save</Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default editSection;
