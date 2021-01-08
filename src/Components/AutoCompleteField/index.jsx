import React, { useState, useRef, useEffect } from "react";
import OutsideAlerter from "../OutsideAlerter/";
import styles from "./autoCompleteField.module.css";
import { KEYS_MAPPING } from "../../constants";
import getSuggestions from "../../Api/index";

const AutoCompleteField = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchedWord, setSearchedWord] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const inputRef = useRef();

  //onchange of input value we have to search suggestions
  useEffect(() => {
    //Do not show suggestions if input value is empty string
    if (inputValue !== "") {
      const lastCharacter = inputValue.slice(-1);
      //Do not show suggestions if last character is space(" ")
      if (lastCharacter === " ") {
        setOptions([]);
        return;
      }

      //Find suggestions based on last word
      const inputs = inputValue.split(" ").filter((word) => word !== "");
      const wordtoBeSearched = inputs.pop();

      setSearchedWord(wordtoBeSearched);
      getSuggestions(wordtoBeSearched).then((suggestions) => {
        setOptions(suggestions);
      });
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const onSelectOption = (inputOption) => {
    //set focus to input on select
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }

    //If API does not return any result and value is selected, setting the typed value with space
    if (inputOption === undefined) {
      setInputValue(inputValue.concat(" "));
    } else {
      //Append suggestion and update  input value
      const option = inputOption + " ";

      let updatedValue = inputValue;

      if (inputValue !== "") {
        const words = inputValue.split(" ").slice(0, -1);
        words.push(option);
        updatedValue = words.join(" ");
      } else {
        updatedValue.concat(option);
      }
      setInputValue(updatedValue);
      setActiveIndex(0);
    }
  };

  //Highlights the matched characters in suggestions
  const highlightOption = (option) => {
    return option.replace(
      new RegExp(searchedWord, "gi"),
      (match) => `<span class="${styles.highlight}">${match}</span>`
    );
  };

  //Selecting suggestions through key press
  const handleKeyPress = (event) => {
    if (event.keyCode === KEYS_MAPPING.ENTER) {
      onSelectOption(options[activeIndex]);
    } else if (event.keyCode === KEYS_MAPPING.UP_ARROW) {
      event.preventDefault();
      if (activeIndex === 0) {
        return;
      }
      setActiveIndex(activeIndex - 1);
    } else if (event.keyCode === KEYS_MAPPING.DOWN_ARROW) {
      event.preventDefault();
      if (activeIndex === options.length - 1) {
        return;
      }
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <OutsideAlerter actionHandler={() => setShowOptions(false)}>
      <div className={styles.searchContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.inputInnerContainer}>
            <input
              className={styles.inputSearch}
              ref={inputRef}
              type="text"
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => handleKeyPress(event)}
              onFocus={() => {
                setShowOptions(true);
              }}
              value={inputValue}
            />
          </div>
        </div>
        {showOptions && options.length !== 0 && (
          <div className={styles.optionsContainer}>
            {options.map((option, index) => (
              <div
                key={option}
                className={
                  index === activeIndex ? styles.activeOption : styles.option
                }
                onClick={() => onSelectOption(option)}
                dangerouslySetInnerHTML={{ __html: highlightOption(option) }}
              />
            ))}
          </div>
        )}
      </div>
    </OutsideAlerter>
  );
};
export default AutoCompleteField;
