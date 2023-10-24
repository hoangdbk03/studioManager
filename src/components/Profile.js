import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AppConText } from '../util/AppContext'
import AxiosIntance from '../util/AxiosIntance';


const Profile = () => {

  //lấy dữ liệu được lưu từ AppConText
  const {inforUser} = useContext(AppConText);
  const {setisLogin} = useContext(AppConText);

  const [idsession, setidsession] = useState(inforUser.session_id);

  const logout = async ()=>{
    try {
      const response = await AxiosIntance().get("/user/logout/"+idsession);
      if (response) {
        setisLogin(false);
        ToastAndroid.show("Đăng xuất thành công", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Đăng xuất thất bại", ToastAndroid.SHORT);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: inforUser.avatar}} style={{height: 50, width: 50}}/>
      <Text>{inforUser.email}</Text>
      <Text>{inforUser.name}</Text>
      <Text>{inforUser.role}</Text>
      <TouchableOpacity>
        <Text>Update profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout}>
        <Text>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})