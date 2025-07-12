// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

// type RootStackParamList = {
//   ProjectDetails: {
//     id: string;
//     title: string;
//     description: string;
//     dueDate: string;
//   };
// };

// type ProjectDetailsRouteProp = RouteProp<RootStackParamList, 'ProjectDetails'>;

// const ProjectDetailsScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const route = useRoute<ProjectDetailsRouteProp>();

//   const { title, description, dueDate } = route.params;

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text style={styles.backText}>← Back</Text>
//       </TouchableOpacity>

//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.label}>Description:</Text>
//       <Text style={styles.text}>{description}</Text>
//       <Text style={styles.label}>Due Date:</Text>
//       <Text style={styles.text}>{dueDate}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     marginBottom: 20,
//   },
//   backText: {
//     color: '#007bff',
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     marginTop: 10,
//     fontWeight: '600',
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default ProjectDetailsScreen;
