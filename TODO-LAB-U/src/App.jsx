import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, NavLink, Link, useParams, useNavigate } from 'react-router-dom'
import {
  House, Layers3, BookOpen, Users, Plus, Check, Trash2, ArrowLeft,
  ListTodo, Clock3, CircleCheck, Sparkles, Flower2, ChevronRight,
  Search, Heart, ClipboardList, Menu, X
} from 'lucide-react'

const starterGroups = [
  { id: 'school', name: 'School Activities', color: 'pink', icon: '🎀' },
  { id: 'personal', name: 'Personal Tasks', color: 'beige', icon: '🌷' },
  { id: 'projects', name: 'Projects', color: 'sage', icon: '🪴' },
  { id: 'daily', name: 'Daily Tasks', color: 'lavender', icon: '☁️' },
]
const starterTasks = [
  { id: 't1', groupId: 'school', title: 'Review laboratory instructions', done: false, createdAt: Date.now() },
  { id: 't2', groupId: 'school', title: 'Finish project documentation', done: true, createdAt: Date.now() - 1000 },
  { id: 't3', groupId: 'personal', title: 'Organize study desk', done: false, createdAt: Date.now() },
]
const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch { return fallback }
}

function App() {
  const [groups, setGroups] = useState(() => readStorage('petal-groups', starterGroups))
  const [tasks, setTasks] = useState(() => readStorage('petal-tasks', starterTasks))
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => localStorage.setItem('petal-groups', JSON.stringify(groups)), [groups])
  useEffect(() => localStorage.setItem('petal-tasks', JSON.stringify(tasks)), [tasks])

  const addGroup = (name) => {
    const clean = name.trim()
    if (!clean || groups.some(g => g.name.toLowerCase() === clean.toLowerCase())) return false
    const id = `group-${Date.now()}`
    setGroups(prev => [...prev, { id, name: clean, color: 'pink', icon: '🌸' }])
    return true
  }
  const deleteGroup = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id))
    setTasks(prev => prev.filter(t => t.groupId !== id))
  }
  const addTask = (groupId, title) => {
    const clean = title.trim()
    if (!clean) return false
    setTasks(prev => [{ id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`, groupId, title: clean, done: false, createdAt: Date.now() }, ...prev])
    return true
  }
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const navItems = [
    { to: '/', label: 'Dashboard', icon: House, end: true },
    { to: '/groups', label: 'Task Groups', icon: Layers3 },
    { to: '/guide', label: 'User Guide', icon: BookOpen },
    { to: '/developers', label: 'Developers', icon: Users },
  ]
  return (
    <div className="min-h-screen bg-[#fbf7f3] text-[#4d403c] md:flex">
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-[#eee0d9] bg-[#fffaf7] px-5 py-7">
        <Brand />
        <p className="mb-3 mt-10 px-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#b39a91]">Workspace</p>
        <nav className="space-y-2">
          {navItems.map(item => <SideLink key={item.to} item={item} />)}
        </nav>
        <div className="mt-auto rounded-3xl bg-[#f8e6e8] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#c87991]"><Heart size={19} /></div>
          <p className="font-semibold">One thing at a time.</p>
          <p className="mt-1 text-sm leading-6 text-[#876f69]">Small steps make lovely progress. You've got this!</p>
          <div className="mt-4 flex gap-1 text-[#c87991]"><span>✿</span><span>✿</span><span>✿</span></div>
        </div>
        <p className="mt-5 text-center text-xs text-[#b5a39b]">RJMN CheckList · Stay organized softly</p>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eee0d9] bg-[#fbf7f3]/95 px-4 py-4 backdrop-blur md:hidden">
          <Brand />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl border border-[#eadbd4] bg-white p-2" aria-label="Toggle navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        {mobileOpen && <nav className="space-y-2 border-b border-[#eee0d9] bg-[#fffaf7] p-4 md:hidden">
          {navItems.map(item => <SideLink key={item.to} item={item} onClick={() => setMobileOpen(false)} />)}
        </nav>}
        <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 md:px-8 md:py-10">
          <Routes>
            <Route path="/" element={<Dashboard groups={groups} tasks={tasks} />} />
            <Route path="/groups" element={<GroupsPage groups={groups} tasks={tasks} addGroup={addGroup} deleteGroup={deleteGroup} />} />
            <Route path="/groups/:groupId" element={<GroupTasks groups={groups} tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <footer className="mt-12 border-t border-[#eee0d9] pt-5 text-center text-xs text-[#aa958d]">
            Made with care <span className="text-[#d48fa2]">♥</span> · RJMN CheckList
          </footer>
        </main>
      </div>
    </div>
  )
}

function Brand() {
  return <Link to="/" className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4d6df] text-[#a85f77]"><Flower2 size={23} /></div>
    <div><p className="text-lg font-extrabold tracking-tight text-[#594640]"> RJMN Checklist <span className="text-[#d18ba0]">.</span></p><p className="text-[11px] tracking-wide text-[#b29a91]">YOUR LITTLE PLANNER</p></div>
  </Link>
}
function SideLink({ item, onClick }) {
  const Icon = item.icon
  return <NavLink to={item.to} end={item.end} onClick={onClick} className={({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-[#f5dfe4] text-[#a85f77]' : 'text-[#8d7770] hover:bg-[#f8eee8] hover:text-[#6a5149]'}`
  }><Icon size={18} strokeWidth={1.8} />{item.label}</NavLink>
}
function PageHeading({ eyebrow, title, description, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#c17f93]">{eyebrow}</p><h1 className="text-3xl font-extrabold tracking-tight text-[#4d403c] sm:text-4xl">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#967f77]">{description}</p></div>
    {action}
  </div>
}
function StatCard({ icon: Icon, label, value, note, tint }) {
  return <div className="soft-shadow rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-6">
    <div className="flex items-start justify-between"><p className="text-sm font-medium text-[#947e76]">{label}</p><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tint}`}><Icon size={19} /></span></div>
    <p className="mt-4 text-3xl font-extrabold">{value}</p><p className="mt-1 text-xs text-[#b19c94]">{note}</p>
  </div>
}
function Dashboard({ groups, tasks }) {
  const done = tasks.filter(t => t.done).length
  const pending = tasks.length - done
  const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0
  return <>
    <PageHeading eyebrow="YOUR CALM CORNER" title="A little progress, every day." description="Welcome back! Make space for what matters, one task at a time." action={<Link to="/groups" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d991a7] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c87f97]"><Plus size={17} /> Manage groups</Link>} />
    <section className="pink-gradient soft-shadow relative mb-7 overflow-hidden rounded-[2rem] p-6 sm:p-9">
      <div className="relative z-10 max-w-xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-[#a66c7d]"><Sparkles size={14} /> YOUR DAILY CHECKLIST</div><h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">You don't have to do it all.<br />Just start with one thing.</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#896f69]">Keep your tasks organized and celebrate every little win along the way.</p><Link to={groups.length ? `/groups/${groups[0].id}` : '/groups'} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#a85f77] hover:bg-[#fff9fa]">View my tasks <ChevronRight size={16} /></Link></div>
      <div className="pointer-events-none absolute -right-3 -top-8 text-[180px] opacity-25 sm:right-8 sm:text-[220px]">🌸</div>
    </section>
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <StatCard icon={ListTodo} label="Total tasks" value={tasks.length} note="Everything on your list" tint="bg-[#f8e7df] text-[#b77f6b]" />
      <StatCard icon={CircleCheck} label="Completed" value={done} note="Look at you go!" tint="bg-[#e6eee2] text-[#718b68]" />
      <StatCard icon={Clock3} label="Still to do" value={pending} note="One step at a time" tint="bg-[#f5dfe6] text-[#bd7790]" />
    </div>
    <section className="soft-shadow rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Your task groups</h2><p className="mt-1 text-sm text-[#a08a82]">A home for every little thing.</p></div><Link to="/groups" className="text-sm font-bold text-[#bd7c91] hover:text-[#9d5e73]">See all →</Link></div>
      {groups.length ? <div className="grid gap-3 sm:grid-cols-2">{groups.slice(0,4).map((g, i) => {
        const count = tasks.filter(t => t.groupId === g.id).length
        const completed = tasks.filter(t => t.groupId === g.id && t.done).length
        return <Link key={g.id} to={`/groups/${g.id}`} className="group flex items-center gap-4 rounded-2xl border border-[#f0e5df] p-4 transition hover:border-[#e7bdc9] hover:bg-[#fff9fa]">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${['bg-[#f8e2e8]','bg-[#f6eadb]','bg-[#e8eee4]','bg-[#eee7f5]'][i%4]}`}>{g.icon || '🌸'}</span>
          <span className="min-w-0 flex-1"><span className="block truncate font-bold">{g.name}</span><span className="mt-1 block text-xs text-[#a58e85]">{completed} of {count} completed</span><span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#f4ece7]"><span className="block h-full rounded-full bg-[#d991a7]" style={{width: `${count ? completed/count*100 : 0}%`}} /></span></span>
          <ChevronRight size={17} className="text-[#c6aaa1] transition group-hover:translate-x-1" />
        </Link>
      })}</div> : <EmptyState title="No groups yet" text="Create a group to start organizing your tasks." link="/groups" linkText="Create a group" />}
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#fbf5f0] p-4"><span className="text-2xl">🌼</span><div><p className="text-sm font-bold">{percent}% of your tasks are complete</p><p className="mt-1 text-xs text-[#a58e85]">Every completed task is progress worth celebrating.</p></div></div>
    </section>
  </>
}
function GroupsPage({ groups, tasks, addGroup, deleteGroup }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter a group name.'); return }
    if (!addGroup(name)) { setError('That group already exists. Try another name.'); return }
    setName(''); setError('')
  }
  return <>
    <PageHeading eyebrow="KEEP IT ORGANIZED" title="Your task groups" description="Separate school, personal, and project tasks into little spaces of their own." />
    <form onSubmit={submit} className="soft-shadow mb-7 flex flex-col gap-3 rounded-3xl border border-[#f0e4de] bg-white p-5 sm:flex-row sm:items-start sm:p-6">
      <div className="flex-1"><label htmlFor="groupName" className="mb-2 block text-sm font-bold">Create a new group</label><input id="groupName" value={name} onChange={e => {setName(e.target.value); setError('')}} placeholder="e.g. Exam Review, Errands..." className="w-full rounded-2xl border border-[#eadbd4] bg-[#fffcfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#c0aca4] focus:border-[#d991a7] focus:ring-4 focus:ring-[#f8e7ec]" />{error && <p className="mt-2 text-xs text-[#b84f68]">{error}</p>}</div>
      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d991a7] px-5 py-3 text-sm font-bold text-white hover:bg-[#c87f97] sm:mt-7"><Plus size={17}/> Add group</button>
    </form>
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">All groups <span className="ml-1 text-sm font-medium text-[#b29a91]">({groups.length})</span></h2><span className="text-xs text-[#a58e85]">Choose a group to open it</span></div>
    {groups.length ? <div className="grid gap-4 sm:grid-cols-2">{groups.map((g,i) => {
      const groupTasks = tasks.filter(t => t.groupId === g.id)
      const done = groupTasks.filter(t => t.done).length
      return <div key={g.id} className="soft-shadow rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between"><span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${['bg-[#f8e2e8]','bg-[#f6eadb]','bg-[#e8eee4]','bg-[#eee7f5]'][i%4]}`}>{g.icon || '🌸'}</span><button onClick={() => {if(window.confirm(`Delete "${g.name}" and all its tasks?`)) deleteGroup(g.id)}} className="rounded-xl p-2 text-[#c4aaa1] hover:bg-[#fff0f2] hover:text-[#bb657e]" aria-label={`Delete ${g.name}`} title="Delete group"><Trash2 size={17}/></button></div>
        <h3 className="mt-4 text-lg font-extrabold">{g.name}</h3><p className="mt-1 text-sm text-[#a08a82]">{groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'} · {done} completed</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f4ece7]"><div className="h-full rounded-full bg-[#d991a7]" style={{width:`${groupTasks.length ? done/groupTasks.length*100 : 0}%`}} /></div>
        <Link to={`/groups/${g.id}`} className="mt-5 flex items-center justify-between rounded-xl bg-[#fbf3f0] px-4 py-3 text-sm font-bold text-[#9e6878] transition hover:bg-[#f8e6ea]">Open task list <ChevronRight size={17}/></Link>
      </div>
    })}</div> : <EmptyState title="Your first group starts here" text="Create a group above to organize your tasks." />}
  </>
}
function GroupTasks({ groups, tasks, addTask, toggleTask, deleteTask }) {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const group = groups.find(g => g.id === groupId)
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const groupTasks = tasks.filter(t => t.groupId === groupId)
  const filtered = useMemo(() => groupTasks.filter(t => (filter === 'all' || (filter === 'done' ? t.done : !t.done)) && t.title.toLowerCase().includes(search.toLowerCase())), [groupTasks, filter, search])
  if (!group) return <div className="py-20 text-center"><div className="text-5xl">🌷</div><h1 className="mt-4 text-2xl font-extrabold">Group not found</h1><p className="mt-2 text-sm text-[#967f77]">This group may have been deleted.</p><button onClick={() => navigate('/groups')} className="mt-5 rounded-xl bg-[#d991a7] px-4 py-2.5 text-sm font-bold text-white">Back to groups</button></div>
  const submit = e => { e.preventDefault(); if (!title.trim()) {setError('Write a task before adding it.');return} addTask(groupId,title);setTitle('');setError('') }
  return <>
    <Link to="/groups" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#a9858a] hover:text-[#9d5e73]"><ArrowLeft size={16}/> All task groups</Link>
    <PageHeading eyebrow="YOUR TASK SPACE" title={<>{group.icon || '🌸'} {group.name}</>} description="Add a task, check off your wins, and take things at your own pace." />
    <form onSubmit={submit} className="soft-shadow mb-6 rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-6">
      <label htmlFor="taskTitle" className="mb-2 block text-sm font-bold">What would you like to get done?</label>
      <div className="flex flex-col gap-3 sm:flex-row"><input id="taskTitle" value={title} onChange={e => {setTitle(e.target.value);setError('')}} placeholder="Write your next little task..." className="min-w-0 flex-1 rounded-2xl border border-[#eadbd4] bg-[#fffcfa] px-4 py-3 text-sm outline-none placeholder:text-[#c0aca4] focus:border-[#d991a7] focus:ring-4 focus:ring-[#f8e7ec]" /><button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d991a7] px-5 py-3 text-sm font-bold text-white hover:bg-[#c87f97]"><Plus size={17}/> Add task</button></div>
      {error && <p className="mt-2 text-xs text-[#b84f68]">{error}</p>}
    </form>
    <section className="soft-shadow rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold">Your checklist</h2><p className="mt-1 text-sm text-[#a08a82]">{groupTasks.filter(t=>t.done).length} of {groupTasks.length} completed</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b39a91]"/><input aria-label="Search tasks" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." className="w-full rounded-xl border border-[#eadbd4] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#d991a7] sm:w-44"/></div><div className="flex rounded-xl bg-[#f8eee8] p-1">{[['all','All'],['pending','To do'],['done','Done']].map(([v,label])=><button key={v} onClick={()=>setFilter(v)} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter===v?'bg-white text-[#a85f77] shadow-sm':'text-[#9d877f]'}`}>{label}</button>)}</div></div></div>
      <div className="mt-5 space-y-3">
        {filtered.map(task => <div key={task.id} className={`flex items-center gap-3 rounded-2xl border p-4 transition ${task.done?'border-[#eee8e1] bg-[#fcfaf7]':'border-[#f0e4de] bg-white hover:border-[#e7bdc9]'}`}>
          <button onClick={()=>toggleTask(task.id)} aria-label={task.done?'Mark as not done':'Mark as done'} title={task.done?'Mark as not done':'Mark as done'} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${task.done?'border-[#91a786] bg-[#91a786] text-white':'border-[#dfb6c2] text-transparent hover:border-[#c77e96]'}`}><Check size={14} strokeWidth={3}/></button>
          <span className={`min-w-0 flex-1 break-words text-sm ${task.done?'text-[#b0a29a] line-through':'font-medium text-[#5c4a44]'}`}>{task.title}</span>
          <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold sm:inline-flex ${task.done?'bg-[#e8eee4] text-[#718b68]':'bg-[#fbf0e7] text-[#b38b6c]'}`}>{task.done?'Done':'Not Done'}</span>
          <button onClick={()=>deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task" className="rounded-xl p-2 text-[#c4aaa1] hover:bg-[#fff0f2] hover:text-[#bb657e]"><Trash2 size={16}/></button>
        </div>)}
        {!filtered.length && <div className="py-10 text-center"><div className="text-4xl">{search?'🔎':'🌷'}</div><p className="mt-3 font-bold">{search?'No matching tasks':'Nothing here just yet'}</p><p className="mt-1 text-sm text-[#a08a82]">{search?'Try another search term.':'Add a task above or choose another filter.'}</p></div>}
      </div>
    </section>
  </>
}
function Guide() {
  const steps = [
    ['Create a task group','Open Task Groups from the navigation. Enter a category name, such as School Activities or Personal Tasks, then click Add group.'],
    ['Add a task','Open Task Groups and choose Open task list on the group you want. Type your task into the input field and select Add task.'],
    ['Mark a task Done or Not Done','Select the round checkbox beside a task. Select it again to change the task back to Not Done.'],
    ['Delete a task or group','Use the trash icon beside a task to delete it. To delete a group, open Task Groups and use its trash icon. Deleting a group also deletes its tasks.'],
    ['Navigate between pages','Use the sidebar or mobile menu to open Dashboard, Task Groups, User Guide, or Developers. Select a group card to view that group’s tasks.'],
    ['Keep track of progress','The Dashboard shows total tasks, completed tasks, and pending tasks. Your changes are saved in this browser automatically.']
  ]
  return <>
    <PageHeading eyebrow="A LITTLE HELP" title="How to use Petal List" description="Everything you need to get started, in a few simple steps." />
    <div className="mb-6 rounded-3xl bg-[#f7e3e7] p-6 sm:p-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#bd7890]"><BookOpen size={22}/></span><div><h2 className="text-lg font-extrabold">Your guide to a calmer CheckList</h2><p className="mt-2 text-sm leading-6 text-[#896f69]">Organize your work into groups, add small tasks, and mark each one complete when you're done. Your progress is saved in your current browser.</p></div></div></div>
    <div className="space-y-4">{steps.map(([title,desc],i)=><div key={title} className="soft-shadow flex gap-4 rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-6"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f8e6ea] font-extrabold text-[#b96f87]">{String(i+1).padStart(2,'0')}</span><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#947e76]">{desc}</p></div></div>)}</div>
  </>
}
function Developers() {
  const [members,setMembers] = useState(()=>readStorage('petal-developers',[{name:'Your Complete Name',role:'Frontend Development & Documentation'}]))
  const [saved,setSaved] = useState(false)
  useEffect(()=>localStorage.setItem('petal-developers',JSON.stringify(members)),[members])
  const update=(i,key,value)=>setMembers(prev=>prev.map((m,j)=>i===j?{...m,[key]:value}:m))
  const add=()=>setMembers(prev=>[...prev,{name:'',role:''}])
  const remove=(i)=>setMembers(prev=>prev.filter((_,j)=>i!==j))
  return <>
    <PageHeading eyebrow="THE PEOPLE BEHIND THE PROJECT" title="Meet the developers" description=" | Sanchez| Perry | Ditoya | Manabo |" />
    <div className="mb-6 rounded-3xl bg-[#f7e3e7] p-6"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#bd7890]"><Users size={24}/></span><div><h2 className="font-extrabold">Our project team</h2><p className="mt-1 text-sm text-[#896f69]">DCIT 26 · Laboratory 3 · CheckList Website</p></div></div></div>
    <div className="soft-shadow rounded-3xl border border-[#f0e4de] bg-white p-5 sm:p-7"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-lg font-bold">Group members</h2><button onClick={add} className="inline-flex items-center gap-1 rounded-xl bg-[#fbf0f2] px-3 py-2 text-xs font-bold text-[#a85f77] hover:bg-[#f7dfe5]"><Plus size={15}/> Add member</button></div>
      <div className="space-y-4">{members.map((m,i)=><div key={i} className="flex flex-col gap-3 rounded-2xl border border-[#f0e4de] p-4 sm:flex-row sm:items-start"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f8e6ea] font-bold text-[#b96f87]">{i+1}</div><div className="grid flex-1 gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-[#8e7770]">Complete name<input value={m.name} onChange={e=>update(i,'name',e.target.value)} placeholder="Enter complete name" className="mt-2 w-full rounded-xl border border-[#eadbd4] px-3 py-2.5 text-sm font-normal text-[#4d403c] outline-none focus:border-[#d991a7]"/></label><label className="text-xs font-bold text-[#8e7770]">Role / contribution<input value={m.role} onChange={e=>update(i,'role',e.target.value)} placeholder="e.g. UI Design, React Development" className="mt-2 w-full rounded-xl border border-[#eadbd4] px-3 py-2.5 text-sm font-normal text-[#4d403c] outline-none focus:border-[#d991a7]"/></label></div>{members.length>1&&<button onClick={()=>remove(i)} title="Remove member" aria-label="Remove member" className="self-end rounded-xl p-2 text-[#c4aaa1] hover:bg-[#fff0f2] hover:text-[#bb657e] sm:self-center"><Trash2 size={16}/></button>}</div>)}</div>
      <button onClick={()=>{localStorage.setItem('petal-developers',JSON.stringify(members));setSaved(true);setTimeout(()=>setSaved(false),2500)}} className="mt-5 rounded-2xl bg-[#d991a7] px-5 py-3 text-sm font-bold text-white hover:bg-[#c87f97]">Save team details</button>{saved&&<span className="ml-3 text-sm font-semibold text-[#718b68]">Team details saved!</span>}
      <p className="mt-4 text-xs leading-5 text-[#a58e85]">Replace the sample name with your real group members before submitting. Team details are saved in this browser.</p>
    </div>
  </>
}
function EmptyState({title,text,link,linkText}) {
  return <div className="rounded-3xl border border-dashed border-[#e8d5cd] bg-white/70 px-6 py-12 text-center"><div className="text-4xl">🌸</div><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm text-[#a08a82]">{text}</p>{link&&<Link to={link} className="mt-4 inline-flex rounded-xl bg-[#d991a7] px-4 py-2.5 text-sm font-bold text-white">{linkText||'Get started'}</Link>}</div>
}
function NotFound() {
  return <div className="py-20 text-center"><div className="text-5xl">🌷</div><h1 className="mt-4 text-3xl font-extrabold">Page not found</h1><p className="mt-2 text-sm text-[#967f77]">Let's get you back to your planner.</p><Link to="/" className="mt-5 inline-flex rounded-xl bg-[#d991a7] px-4 py-2.5 text-sm font-bold text-white">Back to dashboard</Link></div>
}
export default App