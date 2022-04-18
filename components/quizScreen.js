import { StyleSheet, TextInput } from 'react-native';
import { useState, useContext } from 'react';
import { getDatabase, set, ref, onValue, get, update,database } from "firebase/database";
import { Button, View, Text, LoaderScreen } from "react-native-ui-lib"
import * as React from 'react';
import { firebase } from "../firebase/firebaseClient.js"
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import userInfoContext from './userInfoContext';




export default function Quiz({ navigation, route }) {



    const [currentQuestion, setCurrentQuestion] = useState({})
    const [hasSeen, setHasSeen] = useState({})
    const [numCorrect,setNumCorrect] = useState(0)
    const [numSeen,setNumSeen] = useState(0)
    const [homenumCorrect,homesetNumCorrect] = useState(0)
    const [homenumSeen,homesetNumSeen] = useState(0)
    const [awaynumCorrect,awaysetNumCorrect] = useState(0)
    const [awaynumSeen,awaysetNumSeen] = useState(0)
    const [team,setTeam]= useState("")
    const [homeTeam, setHomeTeam] = useState("")
    const [awayTeam, setAwayTeam] = useState("")



    const user = useContext(userInfoContext)


    React.useEffect(() => {
        let db = getDatabase()


        const starCountRef = ref(db, 'users/' + route.params.game + "/" + user.uid);
        onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setTeam(data.team)
        setNumSeen(data.numberAnswered)
        setNumCorrect(data.numberCorrect)
        });

        const teamRef = ref(db, 'games/' + route.params.game);
        onValue(teamRef, (snapshot) => {
        const data = snapshot.val();
        setHomeTeam(data.HomeTeam)
        setAwayTeam(data.AwayTeam)
        homesetNumCorrect(data.HomeCorrect)
        homesetNumSeen(data.HomeAnswered)
        awaysetNumCorrect(data.AwayCorrect)
        awaysetNumSeen(data.AwayAnswered)
        });


        //database references for the game and user tables
        const games = ref(db, `games/${route.params.game}/questionId`)



        //functions set to update the hasSeen and currentQuestion states on db change 

        onValue(games, async (snapshot) => {
            const data = await snapshot.val()
            if (data != null) {
                console.log("here")
                let dbData = await (await get(ref(db, "users/" + route.params.game + "/" + user.uid + "/" + data.id))).val()
                if (dbData == null) {
                    update(ref(db, 'users/' + route.params.game + "/" + user.uid + "/" + data.id), {
                        "answered": false,
                        "correct": false,
                    });

                    let updatedVal = {
                        "answered": false,
                        "correct": false,
                    }

                    setHasSeen(
                        updatedVal
                    )



                } else if (Object.keys(currentQuestion).length == 0) {
                    setHasSeen(
                        dbData,
                    )
                }
                setCurrentQuestion(
                    data
                )
            }


        })

        const answered = ref(db, `users/${route.params.game}/${user.uid}/${currentQuestion.id}`)
        onValue(answered, async (snapshot) => {
            setHasSeen(await snapshot.val())
        })






        // react effect cleanup function to close db connection and avoid memory leak
        return () => {
            off(ref(db, 'games', 'questionId'))
        }


    }, [])

    function updateScore(x,y,a,b){
        const db = getDatabase();
        update(ref(db, 'users/' + route.params.game  + "/" + user.uid), {
            "numberCorrect": x,
            "numberAnswered": y
        });

        if(team == homeTeam){
            update(ref(db, 'games/'+route.params.game),{
                "HomeCorrect":a,
                "HomeAnswered":b
            })
        }
        else{
            update(ref(db, 'games/'+route.params.game),{
                "AwayCorrect":a,
                "AwayAnswered":b
            })

        }
    }


    function handleSubmit(answer) {
     

        let db = getDatabase()

        if (answer == currentQuestion.correctAnswer) {
            update(ref(db, 'users/' + route.params.game + "/" + user.uid + "/" + currentQuestion.id), {
                "answered": true,
                "correct": true,
            })

            setHasSeen({
                "answered": true,
                "correct": true,
            })
            setNumSeen(numSeen+1)
            setNumCorrect(numCorrect+1)
            if(team == homeTeam){
                updateScore(numCorrect+1,numSeen+1,homenumCorrect+1,homenumSeen+1)
                homesetNumCorrect(homenumCorrect+1)
                homesetNumSeen(homenumSeen+1)
           
            }
            else{
                updateScore(numCorrect+1,numSeen+1,awaynumCorrect+1,awaynumSeen+1)
                awaysetNumCorrect(awaynumCorrect+1)
                awaysetNumSeen(awaynumSeen+1)
           
            }
   

        } else {
            update(ref(db, 'users/' + route.params.game + "/" + user.uid + "/" + currentQuestion.id), {
                "answered": true,
                "correct": false,
            })

            setHasSeen({
                "answered": true,
                "correct": false,
            })
            setNumSeen(numSeen+1)
            if(team == homeTeam){
                updateScore(numCorrect,numSeen+1,homenumCorrect,homenumSeen+1)
                homesetNumSeen(homenumSeen+1)
           
            }
            else{
                updateScore(numCorrect,numSeen+1,awaynumCorrect,awaynumSeen+1)
                awaysetNumSeen(awaynumSeen+1)
           
            }
        }
    }

    function handleTimeout() {
        let db = getDatabase()

        update(ref(db, 'users/' + route.params.game + "/" + user.uid + "/" + currentQuestion.id), {
            "answered": true,
            "correct": false,
        })
        setHasSeen({
            "answered": true,
            "correct": false,
        })
          setNumSeen(numSeen+1)
          if(team == homeTeam){
            updateScore(numCorrect,numSeen+1,homenumCorrect,homenumSeen+1)
            homesetNumSeen(homenumSeen+1)
        }
        else{
            updateScore(numCorrect,numSeen+1,awaynumCorrect,awaynumSeen+1)
            awaysetNumSeen(awaynumSeen+1)
        }

    }


    const styles = StyleSheet.create({
        container: {
            margin: 20,
            flex: 1,
            flexDirection: "column",
            alignItems: 'center',
        },
        answerButton: {
            width: 300,
            color: "white"

        }




    })



    if (Object.keys(currentQuestion).length != 0 && Object.keys(hasSeen).length != 0) {

        if (!hasSeen.answered) {
            return (
                <View style={styles.container}>
                    <CountdownCircleTimer
                        colorsTime={[currentQuestion.duration, 5, 2]}
                        isPlaying={true}
                        duration={currentQuestion.duration}
                        colors={["#004777", "#F7B801", "#A30000"]}
                        onComplete={() => handleTimeout()}
                    >
                        {({ remainingTime, color }) => (
                            <Text style={{ color, fontSize: 40 }}>
                                {remainingTime}
                            </Text>
                        )}
                    </CountdownCircleTimer>
                    <Text text30 margin-10 marginB-30 >
                        {currentQuestion.question}
                    </Text>
                    <View>
                        <Button
                            style={styles.answerButton}

                            margin5
                            size={Button.sizes.large}
                            label={currentQuestion.answer1}
                            onPress={() => {
                                handleSubmit(currentQuestion.answer1)
                            } }
                            accessibilityLabel="Learn more about this purple button"
                        />

                        <Button
                            style={styles.answerButton}

                            margin-5
                            size={Button.sizes.large}
                            onPress={() => {
                                handleSubmit(currentQuestion.answer2);

                            } }

                            label={currentQuestion.answer2}
                            accessibilityLabel="Learn more about this purple button"
                        />

                        <Button
                            style={styles.answerButton}
                            margin-5
                            size={Button.sizes.large}
                            onPress={() => {
                                handleSubmit(currentQuestion.answer3);

                            } }

                            label={currentQuestion.answer3}
                            accessibilityLabel="Learn more about this purple button"
                        />
                        <Button
                            style={styles.answerButton}

                            margin-5
                            size={Button.sizes.large}
                            onPress={() => {
                                handleSubmit(currentQuestion.answer4);

                            } }

                            label={currentQuestion.answer4}
                            accessibilityLabel="Learn more about this purple button"
                        />

                    </View>


                </View >)




        } else {
            return (
                <View style={styles.container}>
                    <Text text50 marginT-50 marginB-50 > You Have Already Answered This Question</Text>
                    <Text text30 > Your answer was {String(hasSeen.correct)}</Text>

                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    
                    <Text text50> Score:</Text>
                    <Text text30>{homeTeam}: {(homenumCorrect/homenumSeen).toFixed(2) *100}%</Text>
                    <Text text30>{awayTeam}: {(awaynumCorrect/awaynumSeen).toFixed(2) *100}%</Text>

                </ View>

            )
        }


    } else {
        return (
            <LoaderScreen message={'Awaiting Questions for this game'}></LoaderScreen>
            
        )
    }





}



