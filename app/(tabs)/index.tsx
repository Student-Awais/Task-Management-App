import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { db } from "./firebaseConfig"; // Import Firebase Firestore
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("Low");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const loadedTasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      loadedTasks.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        priority: data.priority,
      });
    });
    setTasks(loadedTasks);
  };

  const addOrUpdateTask = async () => {
    if (!title.trim()) return alert("Task title is required!");

    const newTask = {
      title,
      description,
      deadline,
      status,
      priority,
    };

    if (editTaskId) {
      const taskRef = doc(db, "tasks", editTaskId);
      await updateDoc(taskRef, newTask);
    } else {
      await addDoc(collection(db, "tasks"), newTask);
    }

    loadTasks();
    resetForm();
  };

  const deleteTask = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
    loadTasks();
  };

  const markTaskAsCompleted = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: "completed" });
    loadTasks();
  };

  interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
    priority: string;
  }

  const editTask = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline);
    setStatus(task.status);
    setPriority(task.priority);
    setEditTaskId(task.id);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setStatus("pending");
    setPriority("Low");
    setEditTaskId(null);
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : task.status === filter
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Task Management App</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />
      <TextInput
        style={styles.input}
        placeholder="Priority (Low, Medium, High)"
        value={priority}
        onChangeText={setPriority}
      />
      <TouchableOpacity style={styles.button} onPress={addOrUpdateTask}>
        <Text style={styles.buttonText}>
          {editTaskId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          onPress={() => setFilter("all")}
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("pending")}
          style={[
            styles.filterButton,
            filter === "pending" && styles.filterButtonActive,
          ]}
        >
          <Text>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("completed")}
          style={[
            styles.filterButton,
            filter === "completed" && styles.filterButtonActive,
          ]}
        >
          <Text>Completed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Deadline: {item.deadline}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Priority: {item.priority}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editTask(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              {item.status === "pending" && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => markTaskAsCompleted(item.id)}
                >
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#e9ecef",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#343a40",
  },
  input: {
    borderWidth: 1,
    borderColor: "#6c757d",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#6c757d",
  },
  filterButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  taskItem: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    elevation: 3,
  },
  taskTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  completeButton: {
    backgroundColor: "#ffc107",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
});
