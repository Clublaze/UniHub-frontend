// Lists all org units with their governance status.
// Clicking a scope opens the config editor.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useOrgTree } from '../hooks/useGovernance'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'

// Flattens the nested tree into a list, preserving type + name
function flattenTree(nodes, acc = []) {
  nodes.forEach(node => {
    acc.push(node)
    if (node.children?.length) flattenTree(node.children, acc)
  })
  return acc
}

export default function GovernancePage() {
  const { data: tree = [], isLoading } = useOrgTree()

  const units = flattenTree(tree).filter(u =>
    u.type === 'CLUB' || u.type === 'SOCIETY'
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Governance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage approval workflows and governance rules for each club and society.
          </p>
        </div>
        <Link to="/governance/templates">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1.5" /> View Templates
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader text="Loading org units..." />
      ) : units.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No clubs or societies found. Create the org structure first.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['Name', 'Type', 'Code', ''].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-muted-foreground text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map(unit => (
                <tr key={unit._id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {unit.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {unit.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {unit.code || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/governance/${unit._id}`}>
                      <Button size="sm" variant="ghost">
                        Configure →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}