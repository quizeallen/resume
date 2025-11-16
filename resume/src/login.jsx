import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
function Login() {
    const [name, setName] = useState("")
    const [reason, setReason] = useState("")
    const [visitors, setVisitors] = useState([])
    const [isReturning, setIsReturning] = useState(false)
    const [selectedVisitor, setSelectedVisitor] = useState("")
    const navigate = useNavigate()

    // Center body on mount
    useEffect(() => {
        document.body.classList.add('center-content')
        return () => document.body.classList.remove('center-content')
    }, [])

    // Fetch existing visitors on mount
    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const response = await fetch("/api/users")
                if (response.ok) {
                    const data = await response.json()
                    setVisitors(data)
                } else if (response.status === 503) {
                    console.warn('Database not ready yet')
                }
            } catch (err) {
                console.error('Failed to fetch visitors:', err)
            }
        }
        fetchVisitors()
    }, [])

    const [nameSearch, setNameSearch] = useState("")

    // Check if entered name matches an existing visitor
    const matchedVisitor = visitors.find(v => v.name.toLowerCase() === nameSearch.toLowerCase())

    const handleNameChange = (value) => {
        setNameSearch(value)
        setName(value)
        if (matchedVisitor) {
            setIsReturning(true)
            setSelectedVisitor(value)
        } else {
            setIsReturning(false)
            setSelectedVisitor("")
        }
    }

    const sendData = async (e) => {
        if (e && e.preventDefault) e.preventDefault()

        // If returning visitor, reason is optional
        if (isReturning && selectedVisitor && !reason) {
            // Allow entry without reason for returning visitors
            console.log('Returning visitor:', selectedVisitor)
            alert('Welcome back, ' + selectedVisitor + '!')
            return
        }

        // New visitor or returning without selecting from list must provide reason
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, reason }),
            })

            if (!response.ok) {
                // Try to read the error body (JSON or text)
                let errBody
                try {
                    errBody = await response.json()
                } catch {
                    errBody = await response.text()
                }
                console.error('Server error', response.status, errBody)
                console.log('Submit failed: ' + (errBody?.error || errBody || response.status))
                return
            }

            const result = await response.json()
            console.log('Submit success:', result)
        } catch (err) {
            console.error('Submit error (network):', err)
            alert('Network or CORS error: ' + (err && err.message))
        }
    }
    return (
        <form onSubmit={async (e) => { await sendData(e); navigate('/resume'); }}>
            <fieldset>
                <legend>
                    Please enter your name and reason for viewing:
                </legend>

                {/* Name input - checks against existing visitors */}
                <label>
                    Name:
                    <br />
                    <input
                        type="text"
                        name="name"
                        required
                        minLength={3}
                        onChange={(e) => handleNameChange(e.target.value)}
                        value={name}
                        placeholder="Enter your name"
                    />
                </label>
                {matchedVisitor && (
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                        Welcome back! Reason is optional.
                    </p>
                )}
                <br />

                {/* Reason - optional for returning visitors, required for new */}
                <label>
                    Reason:
                    <br />
                    <input
                        type="text"
                        name="reason"
                        required={!matchedVisitor}
                        onChange={(e) => setReason(e.target.value)}
                        value={reason}
                        placeholder={matchedVisitor ? "(optional for returning visitors)" : "Why are you visiting?"}
                    />
                </label>
                <br />
                <button type="submit">
                    {matchedVisitor ? 'Enter' : 'Submit'}
                </button>
            </fieldset>
        </form>
    )
}
export default Login