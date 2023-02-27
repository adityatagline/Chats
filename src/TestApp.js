import { Image, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";


const TestApp = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}>
            <View>
            <Image source={require("../newMarker.png")} style={{height:wp(20),width:wp(20)}} resizeMode="contain" />
            <Image source={require("../dummy_user.png")} style={{height:wp(18),width:wp(18),position:"absolute",top:wp(0.5),left:wp(1)}} resizeMode="contain" />
            <View style={{backgroundColor:"white",position:"absolute",flexDirection:"row",alignItems:"center",}}>
            <Image source={require("../black_battery_50.png")} style={{height:wp(2.5),width:wp(5),backgroundColor:'white',marginVertical:wp(1)}}resizeMode="contain"  /><Text style={{fontSize:12}}>50%</Text>
            </View>
            </View>
        </View>
    )
}
export default TestApp