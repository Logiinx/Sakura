import React from "react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Partenaires = () => {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-bad-script text-3xl font-bold tracking-widest">
          Panel Admin <br /> Connexion
        </CardTitle>
        <CardDescription>Veuillez vous connecter pour continuer.</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default Partenaires
