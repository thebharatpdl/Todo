

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Pressable,
  ScrollView 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getProjects, saveProjects } from '../utils/storage';
import { Project, ProjectStatus, Task } from '@/types/navigation';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectDetailsScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [addTaskAtTop, setAddTaskAtTop] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const projects = await getProjects();
      const found = projects.find((p) => p.id === projectId);
      setProject(found || null);
      setIsLoading(false);
    };
    fetchProject();
  }, [projectId]);

  const updateProject = async (updatedProject: Project) => {
    const projects = await getProjects();
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    await saveProjects(updatedProjects);
    setProject(updatedProject);
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !project) return;
    
    const newTask = {
      id: `${project.id}-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask],
      totalTasks: project.totalTasks + 1,
      status: project.totalTasks === 0 ? 'In Progress' : project.status
    };

    await updateProject(updatedProject);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddTask(false);
    setAddTaskAtTop(false);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!project) return;
    
    const updatedTasks = project.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const completedCount = updatedTasks.filter(t => t.completed).length;
    const total = updatedTasks.length;
    
    let status: ProjectStatus = 'Not Started';
    if (total > 0) {
      status = completedCount === total ? 'Completed' : 'In Progress';
    }
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      completedTasks: completedCount,
      status
    };

    await updateProject(updatedProject);
  };

  const deleteTask = async (taskId: string) => {
    if (!project) return;
    
    const updatedTasks = project.tasks.filter(task => task.id !== taskId);
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const total = updatedTasks.length;
    
    let status: ProjectStatus = 'Not Started';
    if (total > 0) {
      status = completedCount === total ? 'Completed' : 'In Progress';
    }
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      completedTasks: completedCount,
      totalTasks: total,
      status
    };

    await updateProject(updatedProject);
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveTaskEdit = async () => {
    if (!project || !editingTask) return;
    
    const updatedTasks = project.tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, title: editTitle, description: editDescription }
        : task
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };

    await updateProject(updatedProject);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading project...</Text>
        </View>
      </>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen options={{ title: project.title }} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.projectTitle} numberOfLines={1} ellipsizeMode="tail">
              {project.title}
            </Text>
            <Text style={styles.projectStatus}>
              {project.status} • {project.completedTasks}/{project.totalTasks} tasks
            </Text>
          </View>

          {showAddTask && addTaskAtTop && (
            <View style={styles.addTaskContainer}>
              <Text style={styles.addTaskHeader}>Add New Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Task title"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                autoFocus
              />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Task description (optional)"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                multiline
              />
              <View style={styles.addTaskButtons}>
                <Pressable
                  style={[styles.taskButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddTask(false);
                    setAddTaskAtTop(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.taskButton, styles.saveButton]}
                  onPress={addTask}
                  disabled={!newTaskTitle.trim()}
                >
                  <Text style={styles.buttonText}>Save Task</Text>
                </Pressable>
              </View>
            </View>
          )}

          <FlatList
            data={project.tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <TouchableOpacity 
                  style={styles.checkbox} 
                  onPress={() => toggleTaskCompletion(item.id)}
                >
                  {item.completed ? (
                    <Ionicons name="checkbox" size={24} color="#4CAF50" />
                  ) : (
                    <Ionicons name="square-outline" size={24} color="#ccc" />
                  )}
                </TouchableOpacity>
                
                <Pressable 
                  style={styles.taskContent}
                  onPress={() => startEditingTask(item)}
                >
                  <Text 
                    style={[
                      styles.taskTitle,
                      item.completed && styles.completedTask
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {item.description ? (
                    <Text 
                      style={styles.taskDescription}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  ) : null}
                </Pressable>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteTask(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tasks yet</Text>
                <Text style={styles.emptySubtext}>Tap the button below to add your first task</Text>
              </View>
            }
            scrollEnabled={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingTop: showAddTask && addTaskAtTop ? 16 : 0 }
            ]}
          />
        </ScrollView>

        {showAddTask && !addTaskAtTop && (
          <View style={styles.bottomAddTaskContainer}>
            <Text style={styles.addTaskHeader}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Task description (optional)"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
            />
            <View style={styles.addTaskButtons}>
              <Pressable
                style={[styles.taskButton, styles.cancelButton]}
                onPress={() => setShowAddTask(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.taskButton, styles.saveButton]}
                onPress={addTask}
                disabled={!newTaskTitle.trim()}
              >
                <Text style={styles.buttonText}>Save Task</Text>
              </Pressable>
            </View>
          </View>
        )}

        {!showAddTask && (
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity 
              style={styles.addTaskButton}
              onPress={() => {
                setShowAddTask(true);
                setAddTaskAtTop(true);
              }}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addTaskButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={!!editingTask}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditingTask(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Task title"
                value={editTitle}
                onChangeText={setEditTitle}
              />
              
              <TextInput
                style={[styles.modalInput, styles.modalDescriptionInput]}
                placeholder="Task description"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
              />
              
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditingTask(null)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveTaskEdit}
                >
                  <Text style={styles.buttonText}>Save Changes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#928989ff',
  },
  scrollContainer: {
    flexGrow: 5,
    paddingBottom: 30,
        backgroundColor: '#cbcec8ff',
 // Space for fixed button
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    padding: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor:'#000000ff',
  },
  projectTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 4
  },
  projectStatus: {
    fontSize: 14,
    color: '#666'
  },
  listContent: {
    paddingBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  checkbox: {
    marginRight: 12
  },
  taskContent: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888'
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  addTaskContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
   paddingBottom: 1000,

  },
  bottomAddTaskContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  addTaskHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  addTaskButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  taskButton: {
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4
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
    fontSize: 16,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
        paddingBottom: 50,

  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  addTaskButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16
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
    borderRadius: 10,
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  modalDescriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center'
  }
});