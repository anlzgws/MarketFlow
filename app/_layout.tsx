import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="(tabs)/index" />
      <Stack.Screen name="(tabs)/cadastrarProduto" />
      <Stack.Screen name="(tabs)/gerenciamento" />
      <Stack.Screen name="(tabs)/explore" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}