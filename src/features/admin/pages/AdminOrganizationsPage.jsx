// Interactive org tree — click node to view/edit in right panel
import { useState } from 'react'
import { ChevronRight, ChevronDown, Building2, Users, School } from 'lucide-react'
import {
  useOrgTree,
  useCreateOrgUnit,
  useUpdateOrgUnit,
} from '../../governance/hooks/useGovernance'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Switch } from '../../../components/ui/switch'
import { Badge } from '../../../components/ui/badge'
import { Separator } from '../../../components/ui/separator'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select'

const TYPE_ICON = {
  SCHOOL:  School,
  SOCIETY: Building2,
  CLUB:    Users,
}

// Recursive tree node component
function TreeNode({ node, depth, selected, onSelect, expanded, onToggle }) {
  const Icon     = TYPE_ICON[node.type] || Building2
  const hasKids  = node.children?.length > 0
  const isOpen   = expanded[node._id]
  const isActive = selected?._id === node._id

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer text-sm transition-colors
          ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(node)}
      >
        <button
          className="shrink-0"
          onClick={(e) => { e.stopPropagation(); if (hasKids) onToggle(node._id) }}
        >
          {hasKids
            ? isOpen
              ? <ChevronDown className="h-3.5 w-3.5" />
              : <ChevronRight className="h-3.5 w-3.5" />
            : <span className="w-3.5 inline-block" />}
        </button>
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{node.name}</span>
        {!node.isActive && (
          <Badge variant="secondary" className="text-xs ml-auto">Inactive</Badge>
        )}
      </div>
      {hasKids && isOpen && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child._id}
              node={child}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Right panel — shows and allows editing of selected node
function NodePanel({ node, onClose, tree }) {
  const { mutate: update, isPending: updating } = useUpdateOrgUnit(node._id)

  const [form, setForm] = useState({
    name:        node.name        || '',
    code:        node.code        || '',
    description: node.description || '',
    isActive:    node.isActive    ?? true,
    isPublic:    node.isPublic    ?? true,
    tags:        node.tags?.join(', ') || '',
  })

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = () => {
    update({
      name:        form.name.trim(),
      code:        form.code.trim() || undefined,
      description: form.description.trim() || undefined,
      isActive:    form.isActive,
      isPublic:    form.isPublic,
      tags:        form.tags
                     .split(',')
                     .map(t => t.trim())
                     .filter(Boolean),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{node.name}</h3>
          <p className="text-xs text-muted-foreground">{node.type}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={form.name} onChange={set('name')} />
        </div>
        <div className="space-y-1">
          <Label>Code</Label>
          <Input
            value={form.code}
            onChange={set('code')}
            placeholder="e.g. TECHNOVA"
          />
        </div>
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea rows={2} value={form.description} onChange={set('description')} />
        </div>
        <div className="space-y-1">
          <Label>Tags (comma-separated)</Label>
          <Input
            value={form.tags}
            onChange={set('tags')}
            placeholder="TECHNICAL, AI, CODING"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.isActive}
            onCheckedChange={v => setForm(p => ({ ...p, isActive: v }))}
          />
          <Label>Active</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={form.isPublic}
            onCheckedChange={v => setForm(p => ({ ...p, isPublic: v }))}
          />
          <Label>Public (visible in Explore)</Label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Note: Type and parent cannot be changed after creation.
      </p>

      <Button
        onClick={handleSave}
        disabled={updating}
        className="w-full"
      >
        {updating ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}

// Create org unit form
function CreateNodeForm({ tree, onClose }) {
  const { mutate: create, isPending } = useCreateOrgUnit()
  const [form, setForm] = useState({
    name: '', code: '', type: 'CLUB', parentId: '', description: '',
    isPublic: true, tags: '',
  })

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  // Flatten tree for the parent selector
  const allNodes = []
  const flatten  = (nodes) => nodes.forEach(n => { allNodes.push(n); if (n.children) flatten(n.children) })
  flatten(tree)

  const validParents = allNodes.filter(n => {
    if (form.type === 'SCHOOL')  return false
    if (form.type === 'SOCIETY') return n.type === 'SCHOOL'
    if (form.type === 'CLUB')    return n.type === 'SCHOOL' || n.type === 'SOCIETY'
    return false
  })

  const handleCreate = () => {
    create(
      {
        name:        form.name.trim(),
        code:        form.code.trim() || undefined,
        type:        form.type,
        parentId:    form.parentId   || undefined,
        description: form.description.trim() || undefined,
        isPublic:    form.isPublic,
        tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Create Org Unit</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
      </div>
      <Separator />

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Type *</Label>
          <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v, parentId: '' }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['SCHOOL', 'SOCIETY', 'CLUB'].map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {form.type !== 'SCHOOL' && (
          <div className="space-y-1">
            <Label>Parent *</Label>
            <Select value={form.parentId} onValueChange={v => setForm(p => ({ ...p, parentId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
              <SelectContent>
                {validParents.map(n => (
                  <SelectItem key={n._id} value={n._id}>
                    {n.name} ({n.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1">
          <Label>Name *</Label>
          <Input value={form.name} onChange={set('name')} required />
        </div>
        <div className="space-y-1">
          <Label>Code</Label>
          <Input value={form.code} onChange={set('code')} placeholder="e.g. TECHNOVA" />
        </div>
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea rows={2} value={form.description} onChange={set('description')} />
        </div>
        <div className="space-y-1">
          <Label>Tags (comma-separated)</Label>
          <Input value={form.tags} onChange={set('tags')} placeholder="TECHNICAL, AI" />
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={form.isPublic}
            onCheckedChange={v => setForm(p => ({ ...p, isPublic: v }))}
          />
          <Label>Public</Label>
        </div>
      </div>

      <Button
        onClick={handleCreate}
        disabled={!form.name.trim() || isPending}
        className="w-full"
      >
        {isPending ? 'Creating...' : 'Create Unit'}
      </Button>
    </div>
  )
}

export default function AdminOrganizationsPage() {
  const { data: tree = [], isLoading } = useOrgTree()
  const [expanded, setExpanded]        = useState({})
  const [selected, setSelected]        = useState(null)
  const [creating, setCreating]        = useState(false)

  const toggleExpand = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSelect = (node) => {
    setCreating(false)
    setSelected(node)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organisation Tree</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the hierarchy: Schools → Societies → Clubs
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => { setSelected(null); setCreating(true) }}
        >
          + Add Unit
        </Button>
      </div>

      {isLoading ? (
        <Loader text="Loading org tree..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — tree */}
          <div className="rounded-lg border bg-card p-3 overflow-y-auto max-h-[70vh]">
            {tree.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">
                No org units yet. Create a School first.
              </p>
            ) : (
              tree.map(node => (
                <TreeNode
                  key={node._id}
                  node={node}
                  depth={0}
                  selected={selected}
                  onSelect={handleSelect}
                  expanded={expanded}
                  onToggle={toggleExpand}
                />
              ))
            )}
          </div>

          {/* Right — detail / create panel */}
          {(selected || creating) && (
            <div className="rounded-lg border bg-card p-5">
              {creating ? (
                <CreateNodeForm
                  tree={tree}
                  onClose={() => setCreating(false)}
                />
              ) : selected ? (
                <NodePanel
                  node={selected}
                  onClose={() => setSelected(null)}
                  tree={tree}
                />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  )
}