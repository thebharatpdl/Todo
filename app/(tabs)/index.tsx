import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getProjects, sampleProjects, saveProjects } from '../utils/storage';
import { Project } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const router = useRouter();

  // This will run every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        let data = await getProjects();
        if (data.length === 0) {
          await saveProjects(sampleProjects);
          data = sampleProjects;
        }
        setProjects(data);
      };
      loadData();
    }, [])
  );

  const handlePress = (projectId: string) => {
    router.push({
      pathname: '/screen/ProjectDetailsScreen',
      params: { projectId },
    });
  };

  const deleteProject = async (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    await saveProjects(updatedProjects);
    setProjects(updatedProjects);
  };

  const addNewProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      title: newProjectTitle,
      tasks: [],
      completedTasks: 0,
      totalTasks: 0,
      status: 'Not Started'
    };

    const updatedProjects = [...projects, newProject];
    await saveProjects(updatedProjects);
    setProjects(updatedProjects);
    setNewProjectTitle('');
    setShowAddModal(false);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return styles.completedBadge;
      case 'In Progress':
        return styles.inProgressBadge;
      default: // 'Not Started'
        return styles.notStartedBadge;
    }
  };

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handlePress(item.id)}
    >
      <View style={styles.projectContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.taskCount}>
            {item.completedTasks}/{item.totalTasks} tasks
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              deleteProject(item.id);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={projects} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerText}>My Projects</Text>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Project</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Project title"
              value={newProjectTitle}
              onChangeText={setNewProjectTitle}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={addNewProject}
                disabled={!newProjectTitle.trim()}
              >
                <Text style={styles.buttonText}>Add Project</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa' 
  },
  listContent: {
    padding: 16,
    paddingBottom: 80
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  item: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  projectContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  textContainer: { 
    flex: 1 
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  taskCount: { 
    fontSize: 14, 
    color: '#607d8b',
    marginTop: 4
  },
  statusBadge: { 
    paddingHorizontal: 8,
    paddingVertical: 4, 
    borderRadius: 12,
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  notStartedBadge: { 
    backgroundColor: '#eceff1'
  },
  inProgressBadge: { 
    backgroundColor: '#e3f2fd'
  },
  completedBadge: { 
    backgroundColor: '#e8f5e9'
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});