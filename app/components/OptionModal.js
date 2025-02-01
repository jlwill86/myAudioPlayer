import { Modal, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import color from '../misc/color'


const OptionModal = ({visible, currentItem ,onclose, onPlayPress, onPlayListPress }) => {
    const { filename } = currentItem;
  return (
    <>
    {/* <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide" presentationStyle="pageSheet">
      </Modal>  */}
    <Modal transparent={true} visible={visible} animationType="slide" >
        <View style={styles.modal}>
            <Text style={styles.title} numberOfLines={2}>{filename}</Text>
            <View style={styles.optionContainer}>
                <TouchableWithoutFeedback onPress={onPlayPress}>
                <Text style={styles.optionText}>Play</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={onPlayListPress}>
                <Text style={styles.optionText}>Add to Playlist</Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
        <TouchableWithoutFeedback onPress={onclose}>
        <View style={styles.modalBG}></View>
        </TouchableWithoutFeedback>
        </Modal> 
        </>
  )
}

export default OptionModal

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1000
    },
    optionContainer: {
        padding: 20,
        // alignItems: 'center'
    },
    title: {
        // textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        padding: 10,
        paddingVertical: 10,
        letterSpacing: 1,
    },
    modalBG: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        // flex: 1,
        backgroundColor: color.MODAL_BG,
    }
})