import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme";
import { MagnifyingGlassIcon as SearchIcon } from "react-native-heroicons/outline";
import { MapPinIcon as MapIcon } from "react-native-heroicons/solid";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";

export default function HomeScreen() {
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  const handelLocation = (loc) => {
    console.log(locations);
    setLocations([]);
    setLoading(true);
    
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      console.log(data);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  
  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({ cityName: "Cebu", days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
      
      // Debug weather conditions
      if (data?.forecast?.forecastday) {
        console.log("Weather conditions in forecast:");
        data.forecast.forecastday.forEach((day, index) => {
          console.log(`Day ${index+1}: ${day?.day?.condition?.text}`);
        });
      }
    });
  };
  
  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);
  const { current, location } = weather || {};

  // Only render weather content if we have valid data
  const hasWeatherData = current && location;

  return (
    <View className="h-[7] flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={13}
        source={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        }}
        className="h-full w-full absolute"
      />

      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="white" />
        </View>
      ) : (
        <View 
          className="flex flex-1"
          style={{
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
        >
          {/* SEARCH BAR SECTION */}
          <View className="mx-4 mb-4 relative z-50">
            <View
              className="flex-row items-center px-4 py-2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 25,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <SearchIcon size={20} color="white" />
              <TextInput
                onChangeText={handleDebounce}
                placeholder="Search for a city..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                className="flex-1 text-white text-base ml-3"
                style={{
                  height: 40,
                }}
              />
            </View>
            
            {/* Search Results */}
            {locations.length > 0 ? (
              <View
                className="absolute w-full top-16 rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  return (
                    <TouchableOpacity
                      onPress={() => handelLocation(loc)}
                      key={index}
                      className="flex-row items-center p-4"
                      style={{
                        borderBottomWidth: showBorder ? 1 : 0,
                        borderBottomColor: "rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <MapIcon size={18} color="#666" />
                      <Text className="text-gray-800 font-medium text-base ml-3">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* FORECAST SECTION */}
          <View className="flex-1 flex justify-around mx-4 mb-2">
            {/* Location Display - FIXED */}
            <View className="flex-row items-center justify-center">
              {location?.name && location?.country ? (
                <Text className="text-white text-3xl font-bold text-center">
                  {location.name}, <Text className="text-lg font-semibold">{location.country}</Text>
                </Text>
              ) : location?.name ? (
                <Text className="text-white text-3xl font-bold text-center">
                  {location.name}
                </Text>
              ) : null}
            </View>
            
            {/* IMAGE VIEW */}
            <View className="justify-center flex-row">
              <Image
                source={weatherImages[current?.condition?.text] || weatherImages['other']}
                className="w-52 h-52"
              />
            </View>

            {/* TEMPERATURE CELSIUS */}
            <View className="">
              {current?.temp_c && (
                <Text className="text-center text-6xl text-white font-bold">
                  {current.temp_c}°
                </Text>
              )}
              {current?.condition?.text && (
                <Text className="text-center text-xl text-white tracking-widest">
                  {current.condition.text}
                </Text>
              )}
            </View>
            
            {/* WEATHER CONDITIONS */}
            <View>
              <View className="flex-row space-x-6 items-center ">
                <View className="ml-8 flex-row space-x-1 items-center">
                  <Feather name="wind" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.wind_kph ? `${current.wind_kph} km` : "0 km"}
                  </Text>
                </View>
                <View className="ml-2 flex-row space-x-1 items-center">
                  <Entypo name="drop" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.humidity ? `${current.humidity}%` : "0%"}
                  </Text>
                </View>
                <View className="ml-2 flex-row space-x-1 items-center">
                  <Feather name="sun" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.vis_km ? `${current.vis_km}km` : "0km"}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* NEXT DAYS FORECAST */}
            <View className="flex-row items-center ml-2 ">
              <FontAwesome name="calendar" size={30} color="white" />
              <Text className="text-white font-semibold ml-3 text-lg">
                Daily Forecast
              </Text>
            </View>
            
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {weather?.forecast?.forecastday?.length > 0 ? (
                  weather.forecast.forecastday.map((days, index) => {
                    if (!days || !days.date || !days.day) return null;
                    
                    let date = new Date(days.date);
                    let options = { weekday: "long" };
                    let dayName = date.toLocaleDateString("en-US", options);
                    let temperature = days.day.avgtemp_c;
                    
                    return (
                      <View
                        key={index}
                        className="w-32 rounded-3xl py-4 px-5 ml-3 mb-5"
                        style={{ backgroundColor: theme.bgWhite(0.3) }}
                      >
                        <Image
                          source={weatherImages[days?.day?.condition?.text] || weatherImages['other']}
                          className="w-12 h-12 ml-5"
                        />
                        <Text className="text-slate-300 font-semibold text-center py-1">
                          {dayName}
                        </Text>
                        <Text className="text-white font-semibold text-lg text-center">
                          {temperature !== undefined ? `${Math.round(temperature)}°` : "--"}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-base">No forecast data available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}