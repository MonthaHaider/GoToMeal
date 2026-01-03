import React, { useContext, useState } from "react";
import { Searchbar } from "react-native-paper";
import { View } from "react-native";

import { LocationContext } from "../services/location/location.context";

export const Search = () => {
  const { keyword, search } = useContext(LocationContext);
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  return (
    <View
      style={{
        padding: 16,
        position: "absolute",
        zIndex: 999,
        top: 40,
        width: "100%",
      }}
    >
      <Searchbar
        placeholder="Search for a location"
        value={searchKeyword}
        onSubmitEditing={() => {
          search(searchKeyword);
        }}
        onChangeText={(text) => setSearchKeyword(text)}
      />
    </View>
  );
};
