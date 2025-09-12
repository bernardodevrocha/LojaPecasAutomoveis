<template>
  <div class="screen">
    <div class="card">
      <h1 class="title">
        {{ isLogin ? 'Login' : 'Cadastro' }}
      </h1>

      <!-- Alerta de erro -->
      <div v-if="errorMsg" class="alert alert-error">
        <span>{{ errorMsg }}</span>
        <button class="link-close" @click="errorMsg = ''">Fechar</button>
      </div>

      <!-- Alerta de sucesso -->
      <div v-if="successMsg" class="alert alert-success">
        <span>{{ successMsg }}</span>
        <button class="link-close" @click="successMsg = ''">Fechar</button>
      </div>

      <form @submit.prevent="isLogin ? handleLogin() : handleRegister()" class="form">
        <div v-if="!isLogin" class="form-group">
          <label class="label">Nome</label>
          <input
            v-model.trim="form.name"
            type="text"
            class="input"
            placeholder="Seu nome"
            required
          />
        </div>

        <div class="form-group">
          <label class="label">E-mail</label>
          <input
            v-model.trim="form.email"
            type="email"
            class="input"
            placeholder="email@exemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label class="label">Senha</label>
          <input
            v-model="form.password"
            type="password"
            class="input"
            placeholder="••••••••"
            minlength="6"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="label">Confirmar senha</label>
          <input
            v-model="form.passwordConfirm"
            type="password"
            class="input"
            placeholder="Repita a senha"
            minlength="6"
            required
          />
          <p v-if="passwordMismatch" class="hint-error">As senhas não conferem.</p>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting || ( !isLogin && passwordMismatch )"
        >
          <span v-if="submitting">Enviando...</span>
          <span v-else>{{ isLogin ? 'Entrar' : 'Cadastrar' }}</span>
        </button>
      </form>

      <div class="footer">
        <button class="toggle-btn" @click="toggleMode" :disabled="submitting">
          {{ isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const http = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  timeout: 15000,
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const data = err.response?.data
    const msg =
      (typeof data === 'string' && data) ||
      data?.error ||
      data?.message ||
      (status === 400 && 'Requisição inválida.') ||
      (status === 401 && 'Credenciais inválidas.') ||
      (status === 409 && 'Conflito: e-mail já cadastrado.') ||
      (status === 500 && 'Erro interno no servidor.') ||
      (status === 200 && 'Deu certo logar.') ||
      'Não foi possível completar a ação.'
    return Promise.reject(new Error(msg))
  }
)

const router = useRouter()

const isLogin = ref(true)
const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const passwordMismatch = computed(
  () => !isLogin.value && form.password && form.passwordConfirm && form.password !== form.passwordConfirm
)

function resetMessages() {
  errorMsg.value = ''
  successMsg.value = ''
}

function toggleMode() {
  resetMessages()
  isLogin.value = !isLogin.value
  form.name = ''
  form.email = ''
  form.password = ''
  form.passwordConfirm = ''
}

async function handleRegister() {
  resetMessages()
  if (passwordMismatch.value) {
    errorMsg.value = 'As senhas não conferem.'
    return
  }
  try {
    submitting.value = true
    const { data } = await http.post('/register', {
      name: form.name,
      email: form.email,
      password: form.password,
    })
    successMsg.value = data?.message || 'Cadastro realizado com sucesso!'
    if (data?.user) localStorage.setItem('user', JSON.stringify(data.user))
    try { router.push('/home') } catch (err) { console.log(err) }
  } catch (e) {
    errorMsg.value = e.message || 'Falha ao cadastrar.'
  } finally {
    submitting.value = false
  }
}

async function handleLogin() {
  resetMessages()
  try {
    submitting.value = true
    const { data } = await http.post('/login', {
      email: form.email,
      password: form.password,
    })
    successMsg.value = data?.message || 'Login realizado com sucesso!'
    if (data?.user) localStorage.setItem('user', JSON.stringify(data.user))
    await router.replace("/home")
  } catch (e) {
    errorMsg.value = e.message || 'Falha ao entrar.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* base */
:root{
  --bg: #f3f4f6;           /* cinza claro */
  --card-bg: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;

  --blue: #2563eb;
  --blue-hover: #1d4ed8;

  --red-50: #fef2f2;
  --red-200: #fecaca;
  --red-800: #991b1b;

  --green-50: #ecfdf5;
  --green-200: #a7f3d0;
  --green-800: #065f46;
}

.screen{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 1rem;
}

.card{
  width: 100%;
  max-width: 28rem; /* ~ max-w-md */
  background: var(--card-bg);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0,0,0,.1);
  padding: 1.5rem; /* p-6 */
  color: var(--text);
}

.title{
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

/* alerts */
.alert{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: .75rem;
  border-radius: .375rem;
  border: 1px solid var(--border);
  margin-bottom: .75rem;
}
.alert-error{
  background: var(--red-50);
  border-color: var(--red-200);
  color: var(--red-800);
}
.alert-success{
  background: var(--green-50);
  border-color: var(--green-200);
  color: var(--green-800);
}
.link-close{
  background: none;
  border: none;
  text-decoration: underline;
  color: inherit;
  cursor: pointer;
}

/* form */
.form .form-group{ margin-bottom: .75rem; }
.label{
  display: block;
  font-size: .875rem;
  margin-bottom: .25rem;
  color: #374151;
}
.input{
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: .375rem;
  padding: .5rem .75rem;
  font-size: .95rem;
}
.input:focus{
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .2);
}
.hint-error{
  color: #dc2626;
  font-size: .75rem;
  margin-top: .25rem;
}

/* buttons */
.btn{
  display: inline-block;
  border: none;
  border-radius: .375rem;
  padding: .5rem .75rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary{
  width: 100%;
  background: var(--blue);
  color: #fff;
}
.btn-primary:hover{ background: var(--blue-hover); }
.btn[disabled]{ opacity: .6; cursor: not-allowed; }

/* footer */
.footer{ text-align: center; margin-top: 1rem; }
.toggle-btn{
  background: none;
  border: none;
  color: var(--blue);
  text-decoration: underline;
  cursor: pointer;
}

/* fonte base */
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; }
</style>

<style>
:root{
  --bg:#f3f4f6; --card-bg:#fff; --border:#e5e7eb; --text:#111827; --muted:#6b7280;
  --blue:#2563eb; --blue-hover:#1d4ed8;
  --red-50:#fef2f2; --red-200:#fecaca; --red-800:#991b1b;
  --green-50:#ecfdf5; --green-200:#a7f3d0; --green-800:#065f46;
}
</style>
