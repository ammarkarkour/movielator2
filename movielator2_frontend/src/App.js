import React from 'react';
import {Box,
        Text,
        form,
        Input,
        Image,
        VStack,
        HStack,
        Button,
        Spinner,
        ChakraProvider} from "@chakra-ui/react";


const MovieDetails = ({poster, value, title, imdbR_value, plot, stars, director, genre}) => {
    return (

        <HStack spacing="10px" alignItems="start">
        <Image 
            w= "300px"
            h= "415px"
            borderRadius="10px"
            src={poster}
            alt={value}
        />

        <VStack spacing="10px" alignItems="start">
            <Text fontSize="30px" color="white" fontWeight="bold">
                {title}
            </Text>

            <HStack spacing="20px" alignItems="center" p={0}>
                <Text fontSize="20px" color="white">
                    { imdbR_value ? ("IMDb Rating:"): ""}
                </Text>

                <Text fontSize="20px" color="#E5BC46" fontWeight="bold">
                    {imdbR_value}
                </Text>
            </HStack>

            <Text fontSize="15px" color="#A5A5A5">
                {plot}
            </Text>

            <Text fontSize="15px" color="#A5A5A5">
                {stars}
            </Text>

            <Text fontSize="15px" color="#A5A5A5">
                {director}
            </Text>
            
            <Text fontSize="20px" color="#E5BC46" fontWeight="bold">
                {genre}
            </Text>
        </VStack>
        </HStack>
    )
}

const SearchBar = ({handleSearchChange, handleSearchBarTextInput, isLoading}) => {
    return (

        <HStack spacing="10px">
        <form
            // onClick={handleSearchChange}
            onSubmit={handleSearchChange}
            mg="10px"
        >

            <Input
                w = "450px"
                h = "35px"
                borderRadius="10px"
                placeholder="Enter movie name!"
                onChange={handleSearchBarTextInput}
            />

            <Button 
                w="80px"
                h="35px"
                margin="10px"
                bg="#363636"
                color="white"
                borderRadius="10px" 
                fontWeight="bold"
                onClick={handleSearchChange}
            >
                { isLoading ? <Spinner size="sm" />: "Search" }   
            </Button>
        </form>
        </HStack>
    )
}


class GetMovie extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.setMoviesState = this.setMoviesState.bind(this);
        this.fetchInfo = this.fetchInfo.bind(this);
        this.state = {
            plot: '',
            value: '', 
            title: '',
            stars: '',
            genre: '',
            director: '',
            isLoading: false,
            imdbR_value: undefined,
            poster: ""
        };
        this.baseState = this.state
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    } 

    setMoviesState(movie) {
        let actors =  ((movie['actor']).reduce((total, actor) => {
            return total + actor['name'] + ", "
        }, "")).slice(0, -2)

        this.setState({
            title: movie['name'],
            poster: movie['image'],
            stars: 'Stars: ' + actors,
            plot: movie['description'],
            genre: (movie['genre']).join(", "),
            director: 'Director: ' + movie['director']['name'],
            imdbR_value: movie['aggregateRating']['ratingValue']
        });
    }

    async fetchInfo() {
        let searchName = this.state.value;
        this.setState({ isLoading: true });
        try{
            let jsonDic = await fetch('api/'+searchName);
            const res = await jsonDic.json()
            if (res["name"]) {
                this.setMoviesState(res);
            } else {
                this.setState(this.baseState)
            }
        } catch (error) {
            this.setState(this.baseState)
        } finally {
            this.setState({ isLoading: false })
        }
    }

  render() {
    return (
        
        <VStack spacing="10px">
        <Box w="100%" p={70} color="white"> </Box>

        <Text fontSize="30px" color="#363636"  fontWeight="bold">
          MOVIELATOR
        </Text>

        <SearchBar
            handleSearchChange={(e) => {e.preventDefault(); this.fetchInfo()}}
            handleSearchBarTextInput={this.handleChange} 
            isLoading={this.state.isLoading}
        />

        <Box 
            w="700px"
            h="445px"
            borderRadius="10px"
            bg="#363636"
            p={4}
            color="white"
        >

            <MovieDetails
                poster= {this.state.poster}
                value= {this.state.value}
                title= {this.state.title}
                imdbR_value= {this.state.imdbR_value}
                plot= {this.state.plot}
                stars= {this.state.stars}
                director= {this.state.director}
                genre= {this.state.genre}
            />

        </Box>
        </VStack>

    )
  }
}

export default GetMovie;